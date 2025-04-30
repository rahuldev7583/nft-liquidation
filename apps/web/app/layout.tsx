import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nft Liquidation',
  description: 'Liquidate your nft by any spl token on solana',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
