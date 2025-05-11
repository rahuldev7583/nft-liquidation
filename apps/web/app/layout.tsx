import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LiquiDEX',
  description: 'Liquidate you Nfts to Any SPL token',
  icons: {
    icon: '/zap.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Urbanist:wght@700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
