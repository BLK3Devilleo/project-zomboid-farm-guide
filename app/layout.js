import './globals.css';

export const metadata = {
  title: 'Guía de granja · Project Zomboid',
  description: 'Tutorial interactivo de agricultura y cuidado animal para Project Zomboid Build 42.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
