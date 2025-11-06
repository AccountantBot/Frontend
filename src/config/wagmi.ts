import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { scroll, scrollSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'AccountantBot',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [scroll, scrollSepolia],
  ssr: false,
});
