
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ConfirmEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Confirming email...');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/confirm/${token}`);
        setMessage(res.data.msg);
      } catch (err: any) {
        setMessage(err.response?.data?.msg || 'An unexpected error occurred.');
      }
    };
    confirmEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Email Confirmation</h1>
        <p className="mb-4">{message}</p>
        {message.includes('success') && (
          <Link to="/signin" className="text-blue-500 underline">Go to Sign In</Link>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
