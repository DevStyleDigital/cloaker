import { type Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Toast } from './toast';

import 'styles/globals.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from 'context/theme';
import Script from 'next/script';

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
        <Script
          id="crisp"
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html:
              'window.$crisp=[];window.CRISP_WEBSITE_ID="b01a9862-7d76-4807-9d2d-69157f51f42e";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();',
          }}
        />
        <Script
          type="application/javascript"
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
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
