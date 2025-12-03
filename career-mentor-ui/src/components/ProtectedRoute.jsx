import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../authStore';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    // If user is not logged in, redirect them to the login page
    return <Navigate to="/login" />;
  }

  // If user is logged in, show the page they requested
  return children;
}