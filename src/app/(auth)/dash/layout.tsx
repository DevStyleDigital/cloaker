import { Header } from 'components/header';
import { Sidebar } from 'components/sidebar';

const DashLayout: BTypes.NLPage<{}, true> = async ({ children }) => {
  return (
    <div className="flex overflow-hidden max-h-screen">
      <Sidebar />
      <div className="w-full overflow-y-scroll bg-muted">
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
      </div>
    </div>
  );
};

export default DashLayout;
