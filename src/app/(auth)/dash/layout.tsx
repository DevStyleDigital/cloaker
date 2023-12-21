import { Header } from 'components/header';
import { Sidebar } from 'components/sidebar';

const DashLayout: BTypes.NLPage<{}, true> = async ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-full bg-muted ml-64">
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
      </div>
    </div>
  );
};

export default DashLayout;
