import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../authStore';

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        // Clear error on input change
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', formData);
            const { access, refresh } = response.data;

            login(access, refresh);
            // In a real app, we'd use toast notifications instead of alerts
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);

            // Better error message for the user
            const errorMessage = error.response?.status === 401
                ? 'Invalid credentials. Please try again.'
                : 'Could not connect to the server. Please try later.';

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Updated background to a softer, more vibrant gradient
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {/* Updated card design for a premium feel */}
            <div className="w-full max-w-md px-10 pt-10 pb-7 bg-white rounded-3xl shadow-xl transition-all duration-500 hover:shadow-3xl-blue">
                <h1 className="text-4xl font-black text-center text-gray-900 mb-8">
                    CareerMentor
                </h1>
                {/* <p className="text-xl font-extrabold text-center text-indigo-600 mb-8">
          Welcome Back 👋
        </p> */}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Enhanced Input Field: Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Username
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </span>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                onChange={handleChange}
                                value={formData.username}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 outline-none focus:ring-2 focus:ring-indigo-200 transition duration-200 ease-in-out placeholder-gray-400"
                                placeholder="Your username"
                            />
                        </div>
                    </div>

                    {/* Enhanced Input Field: Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </span>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                onChange={handleChange}
                                value={formData.password}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 outline-none focus:ring-2 focus:ring-indigo-200 transition duration-200 ease-in-out placeholder-gray-400"
                                placeholder="Your password"
                            />
                        </div>
                    </div>

                    {/* Error Message Display */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-md" role="alert">
                            <p className="font-medium text-sm">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 text-lg font-bold text-white rounded-xl shadow-lg transition duration-300 ease-in-out ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed flex items-center justify-center'
                                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Logging In...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </div>
                </form>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-500 pt-5">
                    Don’t have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-indigo-600 hover:text-indigo-800 font-bold transition duration-200"
                    >
                        Sign up now
                    </Link>
                </p>
            </div>
        </div>
    );
}