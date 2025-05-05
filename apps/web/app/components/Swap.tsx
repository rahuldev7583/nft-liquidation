'use client';

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const Swap = () => {
  const [selectedNFT, setSelectedNFT] = useState('');
  const [selectedToken, setSelectedToken] = useState('');

  const handleNFTChange = (e: any) => {
    setSelectedNFT(e?.target?.value);
  };
  const handleTokneChange = (e: any) => {
    setSelectedToken(e.target.value);
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
          <Select>
            <SelectTrigger className='w-full bg-[#321855]/60 border-[#574fb0] text-[#fdb0da] hover:border-[#fdb0da] transition-all focus:ring-[#fdb0da] text-lg py-3'>
              <SelectValue placeholder='Choose an NFT' />
            </SelectTrigger>
            <SelectContent className='bg-[#321855] border-[#574fb0]'>
              <SelectItem
                value='light'
                className='text-[#fdb0da] hover:bg-[#574fb0] focus:bg-[#574fb0] focus:text-[#fdb0da] data-[highlighted]:bg-[#574fb0] data-[highlighted]:text-[#fdb0da] text-lg py-3'
              >
                Light
              </SelectItem>
              <SelectItem
                value='light'
                className='text-[#fdb0da] hover:bg-[#574fb0] focus:bg-[#574fb0] focus:text-[#fdb0da] data-[highlighted]:bg-[#574fb0] data-[highlighted]:text-[#fdb0da] text-lg py-3'
              >
                Dark
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='block text-[#fdb0da] font-medium text-sm mb-1'>
            Select Token to receive
          </label>
          <Select>
            <SelectTrigger className='w-full bg-[#321855]/60 border-[#574fb0] text-[#fdb0da] hover:border-[#fdb0da] transition-all focus:ring-[#fdb0da] text-lg py-3'>
              <SelectValue placeholder='Choose a Token' />
            </SelectTrigger>
            <SelectContent className='bg-[#321855] border-[#574fb0]'>
              <SelectItem
                value='light'
                className='text-[#fdb0da] hover:bg-[#574fb0] focus:bg-[#574fb0] focus:text-[#fdb0da] data-[highlighted]:bg-[#574fb0] data-[highlighted]:text-[#fdb0da] text-lg py-3'
              >
                Light
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          className='w-full mt-6 bg-gradient-to-r from-[#574fb0] to-[#fdb0da] text-[#251755] py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-[#fdb0da]/20 text-lg'
          onClick={() => console.log('swap nft')}
        >
          Swap Now
        </button>
      </div>
    </div>
  );
};

export default Swap;
