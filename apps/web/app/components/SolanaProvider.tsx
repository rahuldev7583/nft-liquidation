'use client';

import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';
import {
  ConnectionProvider,
  useConnection,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react';

import {
  BaseWalletConnectButton,
  BaseWalletMultiButton,
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

import '@solana/wallet-adapter-react-ui/styles.css';
import { BaseWalletAdapter } from '@solana/wallet-adapter-base';

interface SolanaProviderProps {
  children: ReactNode;
}
const DEVNET_SOL_API = process.env.NEXT_PUBLIC_DEVNET_SOL_API || '';
// const MAINNET_SOL_API = process.env.NEXT_PUBLIC_MAINNET_SOL_API || '';
console.log({ DEVNET_SOL_API });

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  //   const network = WalletAdapterNetwork.Devnet;
  //   const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const endpoint = useMemo(() => DEVNET_SOL_API, []);

  const LABELS = {
    'change-wallet': 'Change wallet',
    connecting: 'Connecting ...',
    'copy-address': 'Copy address',
    copied: 'Copied',
    disconnect: 'Disconnect',
    'has-wallet': 'Connect',
    'no-wallet': '  Select Wallet',
  } as const;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className='md:flex ml-20 md:ml-[80%] md:space-x-16 mt-4'>
            <WalletMultiButton>
              <Wallet />

              <p className='ml-4 '>connect wallet</p>
            </WalletMultiButton>
          </div>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
