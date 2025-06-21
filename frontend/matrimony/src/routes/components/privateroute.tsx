// components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const authToken = localStorage.getItem('authToken');

  // Redirect to signup if no token
  return authToken == '1' ? <>{children}</> : <Navigate to="/signup" replace />;
};
// const PrivateRoute: React.FC<Props> = ({ children }) => {
//   const authToken = localStorage.getItem('authToken');
//   return authToken ? <>{children}</> : <Navigate to="/signup" replace />;
// };

export default PrivateRoute;
