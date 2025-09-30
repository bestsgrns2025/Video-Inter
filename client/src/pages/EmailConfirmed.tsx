
import { Link } from 'react-router-dom';

const EmailConfirmed = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">Email Confirmed!</h1>
                <p className="text-gray-700 mb-6">Thank you for confirming your email address. You can now sign in to your account.</p>
                <Link to="/signin" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Go to Sign In
                </Link>
            </div>
        </div>
    );
};

export default EmailConfirmed;
