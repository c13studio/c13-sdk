import { defineChain } from 'viem'

export const MorphMainnet = defineChain({
  id: 2818,
  name: 'Morph Mainnet',
  network: 'morph-mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-quicknode.morphl2.io'],
    },
    public: {
      http: ['https://rpc-quicknode.morphl2.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Morph Explorer',
      url: 'https://explorer.morphl2.io',
    },
    etherscan: {
      name: 'Morph Explorer',
      url: 'https://explorer.morphl2.io',
    },
  },
})
