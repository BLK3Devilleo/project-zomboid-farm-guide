import Script from 'next/script';
import ClarityAnalytics from './components/ClarityAnalytics';
import './globals.css';

export const metadata = {
  title: 'Guía de granja y Hub de Servidores · Project Zomboid B42',
  description: 'Directorio táctico de servidores dedicados y tutorial de supervivencia para Project Zomboid.',
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

        {/* Microsoft Clarity Tag */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "yuppdlr6rl");
            `,
          }}
        />
      </head>
      <body>
        <ClarityAnalytics />
        {children}
      </body>
    </html>
  );
}
