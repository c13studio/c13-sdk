import { defineChain } from 'viem'

export const MorphHoodiTestnet = defineChain({
  id: 2910,
  name: 'Morph Hoodi Testnet',
  network: 'morph-hoodi-testnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-hoodi.morphl2.io'],
    },
    public: {
      http: ['https://rpc-hoodi.morphl2.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Morph Hoodi Explorer',
      url: 'https://explorer-hoodi.morphl2.io',
    },
    etherscan: {
      name: 'Morph Hoodi Explorer',
      url: 'https://explorer-hoodi.morphl2.io',
    },
  },
})
