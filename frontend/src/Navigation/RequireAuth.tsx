import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { authTokenSelector } from '../redux/slices/auth/selectors';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector(authTokenSelector);
  if (!token) {
    return <Navigate to="/auth" />;
  }
  return children;
};

export default RequireAuth;
