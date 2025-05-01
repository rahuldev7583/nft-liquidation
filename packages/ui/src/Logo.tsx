import { Zap } from 'lucide-react';

const Logo = () => {
  return (
    <div className='flex items-center'>
      <div className='w-8 h-8 rounded-md bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center'>
        <Zap size={20} className='text-white' />
      </div>
      <span className='ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400'>
        LiquiDeX
      </span>
    </div>
  );
};

export default Logo;
