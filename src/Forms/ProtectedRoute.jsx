
import { UserAuthContext } from './UserAuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user } = UserAuthContext();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }
// children is a placeholder for components that are nested inside ProtectedRoute
  return children;
}

export default ProtectedRoute;
