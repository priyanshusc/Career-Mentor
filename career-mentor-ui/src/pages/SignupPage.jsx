import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  // 1. Add a new state to hold errors
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous errors before a new submission
    setErrors({});
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/signup/', formData);
      console.log('Signup successful:', response.data);
      alert('Account created successfully! Please log in.');
      navigate('/login'); // 👈 CHANGED: Redirect to login page on success
    } catch (error) {
      console.error('Signup failed:', error.response.data);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Signup failed. Please try again.' });
      }
    }
  };

  return (
    // Enhanced background matching the login page
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Enhanced card design: More padding, rounded, and a strong shadow */}
      <div className="w-full max-w-md px-10 pt-10 pb-7 bg-white rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-7">
          Create Your Account
        </h1>
        {/* <p className="text-center text-lg text-indigo-600 mb-8">
          Join CareerMentor to start analyzing your resume
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
                placeholder="Choose a unique username"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 outline-none focus:ring-indigo-200 transition duration-200 ease-in-out placeholder-gray-400 ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.username && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                {errors.username[0]}
              </p>
            )}
          </div>
          
          {/* Enhanced Input Field: Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                onChange={handleChange}
                value={formData.email}
                placeholder="Enter your professional email"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 outline-none focus:ring-indigo-200 transition duration-200 ease-in-out placeholder-gray-400 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                {errors.email[0]}
              </p>
            )}
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
                placeholder="At least 8 characters"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:border-indigo-500 focus:ring-2 outline-none focus:ring-indigo-200 transition duration-200 ease-in-out placeholder-gray-400 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                {errors.password[0]}
              </p>
            )}
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              // Assuming you have an 'isLoading' state to disable the button
              // disabled={isLoading} 
              className="w-full py-3 text-lg font-bold text-white rounded-xl shadow-lg transition duration-300 ease-in-out bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        
        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 pt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-bold transition duration-200"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
);
}