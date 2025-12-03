import { Link } from 'react-router-dom';
import { useAuthStore } from '../authStore';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuthStore();

  return (
    // Enhanced Navbar container: darker shadow, slight border for definition, and fixed position
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 sm:px-10 py-4 bg-white border-b border-gray-100 shadow-lg">
      
      {/* Brand/Logo */}
      <h1 className="text-3xl font-black text-slate-700 tracking-wide">
        <Link to="/">AI SkillPath</Link>
      </h1>
      
      {/* Navigation Links and Buttons */}
      <div className="space-x-4 sm:space-x-6 flex items-center">
        
        {/* Home Link */}
        {/* <Link 
          to="/" 
          className="text-gray-600 hover:text-gray-400 font-medium transition-colors duration-200 text-base hidden sm:block"
        >
          Home
        </Link> */}

        {/* Show Dashboard link only if logged in */}
        {isLoggedIn && (
          <Link 
            to="/dashboard" 
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200 text-base"
          >
            Dashboard
          </Link>
        )}

        {isLoggedIn ? (
          // Logout button: Styled to match the professional theme
          <button
            onClick={logout}
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-red-600 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Logout
          </button>
        ) : (
          // Get Started link: Uses the vibrant indigo/blue gradient from Login/Signup
          <Link
            to="/login"
            className="text-white font-bold px-5 py-2 rounded-xl shadow-lg transition-all duration-200 ease-in-out bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 hover:shadow-xl transform hover:scale-[1.01]"
          >
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}