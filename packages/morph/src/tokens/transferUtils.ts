import { formatUnits, parseUnits } from 'viem'
import { MORPH_TOKENS, type TokenSymbol, type ChainId } from './constants'

export interface TransferValidationResult {
  isValid: boolean
  error?: string
}

export interface FormattedAmount {
  raw: string
  formatted: string
  decimals: number
}

/**
 * Validate transfer amount against user balance
 */
export function validateTransferAmount(
  amount: string,
  balance: string | undefined,
  decimals: number
): TransferValidationResult {
  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'Amount is required' }
  }

  const numAmount = Number(amount)
  if (isNaN(numAmount) || numAmount <= 0) {
    return { isValid: false, error: 'Amount must be a positive number' }
  }

  if (!balance) {
    return { isValid: false, error: 'Balance not available' }
  }

  const numBalance = Number(balance)
  if (numAmount > numBalance) {
    return { isValid: false, error: 'Insufficient balance' }
  }

  // Check for too many decimal places
  const decimalPlaces = (amount.split('.')[1] || '').length
  if (decimalPlaces > decimals) {
    return { isValid: false, error: `Too many decimal places. Max: ${decimals}` }
  }

  return { isValid: true }
}

/**
 * Format amount for display with proper decimals
 */
export function formatTransferAmount(
  amount: string,
  decimals: number,
  symbol: string
): FormattedAmount {
  const numAmount = Number(amount)
  const formatted = numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.min(decimals, 8) // Cap display decimals at 8
  })

  return {
    raw: amount,
    formatted: `${formatted} ${symbol}`,
    decimals
  }
}

/**
 * Calculate gas estimate for transfer
 */
export function estimateTransferGas(
  token: TokenSymbol | string,
  chainId: ChainId
): bigint {
  const chainTokens = MORPH_TOKENS[chainId]
  const isNativeETH = token === 'ETH' || 
    (chainTokens?.[token as TokenSymbol]?.address === '0x0000000000000000000000000000000000000000')

  if (isNativeETH) {
    return BigInt(21000) // Standard ETH transfer gas
  } else {
    return BigInt(65000) // Standard ERC-20 transfer gas
  }
}

/**
 * Parse amount string to BigInt with proper decimals
 */
export function parseTransferAmount(amount: string, decimals: number): bigint {
  try {
    return parseUnits(amount, decimals)
  } catch (error) {
    throw new Error(`Invalid amount format: ${amount}`)
  }
}

/**
 * Format BigInt amount to readable string
 */
export function formatTransferAmountFromBigInt(
  amount: bigint,
  decimals: number,
  symbol: string
): string {
  const formatted = formatUnits(amount, decimals)
  const numFormatted = Number(formatted).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.min(decimals, 8)
  })
  return `${numFormatted} ${symbol}`
}

/**
 * Get transfer fee estimate (placeholder - would integrate with gas price oracle)
 */
export function estimateTransferFee(
  token: TokenSymbol | string,
  chainId: ChainId,
  gasPrice: bigint = BigInt(1000000000) // 1 gwei default
): {
  gasLimit: bigint
  gasPrice: bigint
  totalFee: bigint
  formattedFee: string
} {
  const gasLimit = estimateTransferGas(token, chainId)
  const totalFee = gasLimit * gasPrice
  const formattedFee = formatUnits(totalFee, 18) // ETH has 18 decimals

  return {
    gasLimit,
    gasPrice,
    totalFee,
    formattedFee: `${Number(formattedFee).toFixed(6)} ETH`
  }
}

/**
 * Validate recipient address format
 */
export function validateRecipientAddress(address: string): TransferValidationResult {
  if (!address || address.trim() === '') {
    return { isValid: false, error: 'Recipient address is required' }
  }

  if (!address.startsWith('0x')) {
    return { isValid: false, error: 'Address must start with 0x' }
  }

  if (address.length !== 42) {
    return { isValid: false, error: 'Address must be 42 characters long' }
  }

  // Basic hex validation
  const hexPattern = /^0x[a-fA-F0-9]{40}$/
  if (!hexPattern.test(address)) {
    return { isValid: false, error: 'Invalid address format' }
  }

  return { isValid: true }
}
