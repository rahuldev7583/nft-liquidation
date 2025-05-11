'use client';

import React, { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';

import {
  BaseWalletMultiButton,
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { Wallet } from 'lucide-react';

interface SolanaProviderProps {
  children: ReactNode;
}

const DEVNET_SOL_API = process.env.NEXT_PUBLIC_DEVNET_SOL_API || '';
const MAINNET_SOL_API = process.env.NEXT_PUBLIC_MAINNET_SOL_API || '';

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  const endpoint = useMemo(() => DEVNET_SOL_API, []);

  const LABELS: any = {
    'change-wallet': 'Change wallet',
    connecting: 'Connecting ...',
    'copy-address': 'Copy address',
    copied: 'Copied',
    disconnect: 'Disconnect',
    'has-wallet': 'Connect',
    'no-wallet': (
      <>
        <Wallet />
        <p className='ml-2'>connect wallet</p>
      </>
    ),
  } as const;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className='absolute top-6 right-6 z-50'>
            <BaseWalletMultiButton
              className='!bg-gradient-to-r from-[#fdb0da] to-[#574fb0] hover:opacity-90 transition-opacity'
              labels={LABELS}
            />
          </div>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
