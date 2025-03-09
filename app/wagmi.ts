import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';
import {
  baseSepolia,
  sepolia,
} from 'wagmi/chains';

const ancient8chain = {
  id: 888888888,
  iconUrl: '/ancient8.avif',
  iconBackground: '#000',
  name: 'Ancient8',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ancient8.gg'],
    },
    public: {
      http: ['https://rpc.ancient8.gg'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ancient8 Explorer',
      url: 'https://scan.ancient8.gg',
    },
  },
  contracts: {
    multicall3: {
      address: '0xb76d6e8c82D06fd262Ef3799db73d5A724108d4e',
      blockCreated: 14802507,
    },
  }
} as const satisfies Chain;

const ancient8chaintestnet = {
  id: 28122024,
  iconUrl: '/ancient8.avif',
  iconBackground: '#000',
  name: 'Ancient8 Testnet',
  nativeCurrency: {
    name: 'aETH',
    symbol: 'aETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpcv2-testnet.ancient8.gg'],
    },
    public: {
      http: ['https://rpcv2-testnet.ancient8.gg'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ancient8 Explorer',
      url: 'https://scanv2-testnet.ancient8.gg',
    },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'AgentFather',
  projectId: '8d6ff1481991b663597c021bb7e0a6ff',
  chains: [
    baseSepolia,
    sepolia,
    ancient8chaintestnet
  ],
  ssr: true,
});
