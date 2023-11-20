import { AuthProvider } from 'contexts/auth';

const AuthLayout: BTypes.NLPage = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthLayout;
