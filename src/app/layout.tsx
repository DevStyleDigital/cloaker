import { type Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Toast } from './toast';

import 'styles/globals.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from 'context/theme';

export const dynamic = 'force-dynamic';

const roboto = Roboto({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '',
  description: '',
};

const RootLayout: BTypes.NLPage = ({ children }) => {
  return (
    <html lang="pt-br" className={roboto.className}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toast />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
