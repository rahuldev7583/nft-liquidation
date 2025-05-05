import React from 'react';
import Swap from './Swap';
import { SolanaProvider } from './SolanaProvider';
import Logo from './Logo';

const Landing = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#251755] via-[#321855] to-[#574fb0] flex flex-col items-center px-4 py-6 relative overflow-hidden'>
      {/* Logo positioned at top left */}
      <div className='absolute top-6 left-6 z-50 text-[#fdb0da]'>
        <Logo />
      </div>

      <SolanaProvider>
        {/* Decorative elements */}
        <div className='absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#fdb0da]/10 blur-3xl'></div>
        <div className='absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#574fb0]/20 blur-3xl'></div>

        {/* Content container */}
        <div className='relative z-10 max-w-4xl w-full text-center mb-8 space-y-6 mt-32'>
          <div className='space-y-3'>
            <h2 className='text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#fdb0da] to-[#574fb0]'>
              NFT to Token. <span className='italic'>Instantly.</span>
            </h2>

            <h4 className='text-xl md:text-2xl font-medium text-[#fdb0da]/90 max-w-2xl mx-auto'>
              Liquidate your NFT to any SPL Token with seamless conversion
            </h4>
          </div>

          {/* Subtle divider */}
          <div className='w-24 h-1 bg-gradient-to-r from-[#fdb0da] to-[#574fb0] rounded-full mx-auto opacity-70'></div>
        </div>

        {/* Swap component with subtle glow */}
        <div className='relative z-10 w-full max-w-lg mx-auto'>
          <div className='absolute inset-0 bg-[#fdb0da]/5 blur-xl rounded-full'></div>
          <Swap />
        </div>

        {/* Subtle footer element */}
        <div className='mt-16 text-[#fdb0da]/50 text-sm font-medium'>
          Secure. Fast. Decentralized.
        </div>
      </SolanaProvider>
    </div>
  );
};

export default Landing;
