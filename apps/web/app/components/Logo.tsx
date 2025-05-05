import { Zap } from 'lucide-react';

const Logo = () => {
  return (
    <div className='flex items-center gap-2 '>
      <Zap size={24} className='text-[#fdcbe5]' />
      <span
        className='text-2xl font-bold  bg-[#fcdaeb] bg-clip-text text-transparent'
        style={{
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: '0.5px',
        }}
      >
        LiquiDeX
      </span>
    </div>
  );
};

export default Logo;
