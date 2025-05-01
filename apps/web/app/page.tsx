import Landing from './components/Landing';
import { SolanaProvider } from './components/SolanaProvider';

export default function Home() {
  return (
    <div>
      <SolanaProvider>
        <Landing />
      </SolanaProvider>
    </div>
  );
}
