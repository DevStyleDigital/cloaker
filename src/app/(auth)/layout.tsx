import { Header } from 'components/header';
import { Sidebar } from 'components/sidebar';
import { AuthProvider } from 'context/auth';

const AuthLayout: BTypes.NLPage = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthLayout;
