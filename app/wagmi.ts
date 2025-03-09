import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';
import {
  baseSepolia,
  sepolia,
} from 'wagmi/chains';


export const config = getDefaultConfig({
  appName: 'AgentFather',
  projectId: '8d6ff1481991b663597c021bb7e0a6ff',
  chains: [
    baseSepolia,
    sepolia
  ],
  ssr: true,
});
