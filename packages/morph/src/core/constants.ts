/**
 * Core constants for the Morph SDK
 */

/** SDK version */
export const SDK_VERSION = '0.0.1'

/** Default configuration values */
export const DEFAULT_CONFIG = {
  /** Default number of decimal places for balance formatting */
  DEFAULT_DECIMALS: 2,
  /** Default number of characters to show in address formatting */
  DEFAULT_ADDRESS_CHARS: 4,
  /** Default timeout for network requests (ms) */
  DEFAULT_TIMEOUT: 30000,
  /** Default gas limit for transactions */
  DEFAULT_GAS_LIMIT: '21000',
} as const

/** Supported chain IDs */
export const SUPPORTED_CHAINS = {
  MORPH_MAINNET: 2818,
  MORPH_TESTNET: 2910,
} as const

/** Native token address (used for ETH) */
export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'

/** Common error messages */
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Wallet not connected',
  INSUFFICIENT_BALANCE: 'Insufficient balance for transaction',
  INVALID_ADDRESS: 'Invalid recipient address',
  INVALID_AMOUNT: 'Invalid transaction amount',
  NETWORK_ERROR: 'Network request failed',
  USER_REJECTED: 'Transaction cancelled by user',
  UNSUPPORTED_TOKEN: 'Token not supported on this network',
  TRANSACTION_FAILED: 'Transaction failed to execute',
} as const

/** Transaction status types */
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
} as const
