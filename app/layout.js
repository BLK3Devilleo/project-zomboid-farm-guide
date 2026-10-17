import Script from 'next/script';
import ClarityAnalytics from './components/ClarityAnalytics';
import './globals.css';

export const metadata = {
  title: 'KnoxOS HUD · Guía de Supervivencia y Servidores Project Zomboid B42',
  description: 'HUD táctico diegético de 1993 para Project Zomboid Build 42: guía de mecánicas, radar de botín, sistema de alerta de meta-eventos, directorio comunitario de servidores y radio en tiempo real.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Google Identity Services SDK */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />

        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KRWBJ9ER2C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-KRWBJ9ER2C');
          `}
        </Script>
      </head>
      <body>
        <ClarityAnalytics />
        {children}
      </body>
    </html>
  );
}
