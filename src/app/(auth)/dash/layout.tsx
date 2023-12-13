import { Header } from 'components/header';
import { Sidebar } from 'components/sidebar';
import { UserProvider } from 'context/user';

const DashLayout: BTypes.NLPage<{}, true> = async ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full overflow-y-auto">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashLayout;
