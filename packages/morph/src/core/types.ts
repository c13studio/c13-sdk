/**
 * Core type definitions for the Morph SDK
 */

export interface SDKConfig {
  /** Default chain ID to use */
  defaultChainId?: number
  /** Enable debug logging */
  debug?: boolean
  /** Custom RPC endpoints */
  rpcEndpoints?: Record<number, string>
}

export interface WalletState {
  /** Whether wallet is connected */
  isConnected: boolean
  /** Connected wallet address */
  address?: string
  /** Current chain ID */
  chainId?: number
  /** Formatted balance string */
  balance?: string
  /** Connect wallet function */
  connect: () => Promise<void>
  /** Disconnect wallet function */
  disconnect: () => Promise<void>
}

export interface TokenInfo {
  /** Token contract address (0x0 for native) */
  address: string
  /** Token symbol */
  symbol: string
  /** Token name */
  name: string
  /** Token decimals */
  decimals: number
  /** Whether this is the native token */
  isNative?: boolean
}

export interface TransactionResult {
  /** Transaction hash */
  hash: string
  /** Whether transaction was successful */
  success: boolean
  /** Block number where transaction was mined */
  blockNumber?: number
  /** Gas used */
  gasUsed?: string
  /** Error message if failed */
  error?: string
}

export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean
  /** Error message if validation failed */
  error?: string
}

export interface PaymentInstruction {
  /** Recipient address */
  to: string
  /** Amount to send */
  amount: string
  /** Token to send */
  token: string
  /** Optional chain ID */
  chainId?: number
  /** Optional memo/note */
  memo?: string
}

export type ErrorCategory = 
  | 'USER_REJECTED'
  | 'INSUFFICIENT_FUNDS'
  | 'NETWORK_ERROR'
  | 'UNSUPPORTED_TOKEN'
  | 'INVALID_INPUT'
  | 'UNKNOWN_ERROR'

export interface ParsedError {
  /** Error category */
  category: ErrorCategory
  /** Human-readable error message */
  message: string
  /** Original error object */
  originalError: unknown
}
