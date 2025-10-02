/**
 * @c13/morph-sdk - Professional TypeScript SDK for Morph blockchain
 * 
 * A comprehensive SDK for building applications on Morph blockchain with
 * seamless wallet integration and payment functionality.
 */

// Core SDK functionality
export * from './core'

// Blockchain configurations
export * from './chains'

// Wallet integrations
export * from './wallets'

// React providers
export * from './providers'

// Token operations
export * from './tokens'

// Utility functions
export * from './utils'

// SDK information
export const SDK_INFO = {
  name: '@c13/morph-sdk',
  version: '0.0.1',
  description: 'Professional TypeScript SDK for Morph blockchain',
} as const