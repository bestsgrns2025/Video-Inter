
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../services/auth';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await signup({ email, password });
            setMessage(res.data.msg);
            setTimeout(() => {
                navigate('/signin');
            }, 3000);
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
            <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
                <h1 className="font-bold text-center text-2xl mb-5">Sign Up</h1>
                <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
                    <form className="px-5 py-7" onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 text-center pb-3">{error}</p>}
                        {message && <p className="text-green-500 text-center pb-3">{message}</p>}
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
                        <input
                            type="email"
                            className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
                        <input
                            type="password"
                            className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">Confirm Password</label>
                        <input
                            type="password"
                            className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                        >
                            <span className="inline-block mr-2">Sign Up</span>
                        </button>
                    </form>
                    <div className="py-5">
                        <div className="text-center">
                            <Link to="/signin" className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                <span className="inline-block ml-1">Already have an account? Sign In</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
