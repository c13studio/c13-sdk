/**
 * Token constants and configurations for Morph blockchain
 */

import type { TokenInfo } from '../core/types'

// Token symbols supported by the SDK
export type TokenSymbol = 'ETH' | 'USDT' | 'USDC' | 'BGB'

// Supported chain IDs
export type ChainId = 2818 | 2910

// Token configurations for each supported chain
export const MORPH_TOKENS: Record<ChainId, Record<TokenSymbol, TokenInfo>> = {
  // Morph Mainnet (2818)
  2818: {
    ETH: {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ether',
      decimals: 18,
      isNative: true,
    },
    USDT: {
      address: '0xf417F5A458eC102B90352F697D6e2Ac3A3d2851f',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
    },
    USDC: {
      address: '0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    BGB: {
      address: '0xA7f8A757C4f7696c015B595F51B2901AC0121B18',
      symbol: 'BGB',
      name: 'Bitget Token',
      decimals: 18,
    },
  },
  // Morph Hoodi Testnet (2910)
  2910: {
    ETH: {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ether',
      decimals: 18,
      isNative: true,
    },
    USDT: {
      address: '0x6FBDF89eF12a197E5F1a4B6E2ddbFC98e638046c',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
    },
    USDC: {
      address: '0x6FBDF89eF12a197E5F1a4B6E2ddbFC98e638046c',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    BGB: {
      address: '0x6FBDF89eF12a197E5F1a4B6E2ddbFC98e638046c',
      symbol: 'BGB',
      name: 'Bitget Token',
      decimals: 18,
    },
  },
} as const

// ERC-20 ABI for balance queries
export const ERC20_ABI = [
  {
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const