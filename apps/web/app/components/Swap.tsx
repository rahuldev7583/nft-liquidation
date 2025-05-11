'use client';
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useWallet } from '@solana/wallet-adapter-react';
import { getNft } from './GetNft';
import axios from 'axios';

const Swap = () => {
  const wallet = useWallet();
  const { signMessage } = wallet;

  const [selectedNFT, setSelectedNFT] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [allNFT, setAllNft] = useState<any[]>([]);
  const [isSwap, setIsSwap] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!wallet || !wallet) {
        setAllNft([]);
        setSelectedNFT('');
        setSelectedToken('');
        return;
      }
      if (wallet?.publicKey) {
        const response = await getNft(wallet.publicKey);
        if (response) {
          setAllNft(response);
        }
      }
    };

    fetchNFTs();
  }, [wallet, wallet.publicKey, wallet.connected]);

  const handleSwap = async () => {
    setIsSwap(true);

    console.log({ selectedNFT, selectedToken });

    if (wallet && wallet.connected && signMessage) {
      const message = `Auth for NFT-SPL Swap: ${Date.now()}`;
      console.log({ message });

      const messageBytes = new TextEncoder().encode(message);

      console.log({ messageBytes });

      const signature = await signMessage(messageBytes);
      console.log({ signature });

      const signatureBase64 = Buffer.from(signature).toString('base64');
      console.log({ signatureBase64 });

      const payload = {
        walletAddress: wallet.publicKey?.toString(),
        message: message,
        signature: signatureBase64,
      };
      console.log({ payload });

      const res = await axios.post(
        'http://localhost:5000/swap/nft-to-token',
        payload
      );

      console.log({ res });
      if (!res) {
        setIsSwap(false);
        setSelectedNFT('');
      }
    }
  };

  return (
    <div className='bg-[#251755] border border-[#574fb0]/40 shadow-xl rounded-2xl p-8 w-full max-w-md mx-auto backdrop-blur-lg relative overflow-hidden'>
      <div className='absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#574fb0]/30 blur-3xl'></div>
      <div className='absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#321855]/40 blur-3xl'></div>

      <div className='relative z-10 space-y-6'>
        <h3 className='text-2xl font-bold text-[#fdb0da] mb-6'>
          Swap Your Assets
        </h3>

        <div className='space-y-2'>
          <label className='block text-[#fdb0da] font-medium text-sm mb-1'>
            Select NFT to swap
          </label>
          <Select onValueChange={setSelectedNFT}>
            <SelectTrigger className='w-full h-40 bg-[#321855]/60 border-[#574fb0] text-[#fdb0da] hover:border-[#fdb0da] transition-all focus:ring-[#fdb0da] focus:ring-offset-0 text-lg py-8 rounded-xl backdrop-blur-sm shadow-inner'>
              <SelectValue placeholder='Choose an NFT' />
            </SelectTrigger>
            <SelectContent className='bg-[#321855] border-[#574fb0] rounded-xl max-h-72 overflow-auto'>
              {wallet &&
                wallet.connected &&
                allNFT.map((nft: any) => (
                  <SelectItem
                    key={nft.metadata.mint}
                    value={nft.metadata.mint}
                    className='text-[#fdb0da] hover:bg-[#574fb0]/50 focus:bg-[#574fb0] focus:text-[#fdb0da] text-lg py-3'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#574fb0]/30 border border-[#fdb0da]/30'>
                        {nft.metadata.uri && (
                          <img
                            src={nft.metadata.uri}
                            alt={nft.metadata.name}
                            className='w-full h-full object-cover'
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://placehold.co/40x40/321855/fdb0da?text=NFT';
                            }}
                          />
                        )}
                      </div>
                      <span className='truncate'>{nft.metadata.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='block text-[#fdb0da] font-medium text-sm mb-1'>
            Select Token to receive
          </label>
          <Select onValueChange={setSelectedToken}>
            <SelectTrigger className='w-full h-16 bg-[#321855]/60 border-[#574fb0] text-[#fdb0da] hover:border-[#fdb0da] transition-all focus:ring-[#fdb0da] focus:ring-offset-0 text-lg py-8 rounded-xl backdrop-blur-sm shadow-inner'>
              <SelectValue placeholder='Choose a Token' />
            </SelectTrigger>
            <SelectContent className='bg-[#321855] border-[#574fb0] rounded-xl'>
              <SelectItem
                value='usdc'
                className='text-[#fdb0da] hover:bg-[#574fb0]/50 focus:bg-[#574fb0] focus:text-[#fdb0da] text-lg py-3'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-[#fdb0da]/30 flex items-center justify-center'></div>
                  <span>USDC</span>
                </div>
              </SelectItem>
              <SelectItem
                value='usdt'
                className='text-[#fdb0da] hover:bg-[#574fb0]/50 focus:bg-[#574fb0] focus:text-[#fdb0da] text-lg py-3'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-[#fdb0da]/30 flex items-center justify-center'></div>
                  <span>USDT</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          className='w-full mt-6 bg-gradient-to-r from-[#574fb0] to-[#fdb0da] text-[#251755] py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-[#fdb0da]/20 text-lg'
          onClick={handleSwap}
        >
          {isSwap ? 'Proccessing' : ' Swap Now'}
        </button>
      </div>
    </div>
  );
};

export default Swap;
