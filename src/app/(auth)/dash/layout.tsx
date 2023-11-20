import { Header } from 'components/header';
import { Sidebar } from 'components/sidebar';

const DashLayout: BTypes.NLPage = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashLayout;
