import { Header } from 'components/header';
import { Sidebar } from 'components/sidebar';
import { UserProvider } from 'context/user';

const AuthLayout: BTypes.NLPage = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default AuthLayout;
