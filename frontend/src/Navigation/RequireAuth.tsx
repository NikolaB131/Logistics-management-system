// import { Navigate } from 'react-router-dom';

// import { useAuth } from '../hooks/useAuth';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  // const { user } = useAuth();
  // if (!user) {
  // return <Navigate to="/auth" />;
  // }
  return children;
};

export default RequireAuth;
