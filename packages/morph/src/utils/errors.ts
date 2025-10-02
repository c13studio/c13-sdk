/**
 * Error handling utilities for the Morph SDK
 */

import type { ErrorCategory, ParsedError } from '../core/types'

/**
 * Parse raw errors into user-friendly messages
 * @param error - The raw error to parse
 * @returns Human-readable error message
 */
export function parseError(error: unknown): string {
  if (!error) return 'Unknown error occurred'

  const errorMessage = typeof error === 'string' ? error : 
    error instanceof Error ? error.message : 
    typeof error === 'object' && error !== null && 'message' in error ? 
    String((error as any).message) : 
    String(error)

  const lowerMessage = errorMessage.toLowerCase()

  // User rejection patterns
  if (lowerMessage.includes('user rejected') || 
      lowerMessage.includes('user denied') ||
      lowerMessage.includes('user cancelled') ||
      lowerMessage.includes('cancelled by user') ||
      lowerMessage.includes('rejected by user')) {
    return 'Transaction cancelled by user'
  }

  // Insufficient funds patterns
  if (lowerMessage.includes('insufficient funds') ||
      lowerMessage.includes('insufficient balance') ||
      lowerMessage.includes('not enough') ||
      lowerMessage.includes('exceeds balance')) {
    return 'Insufficient balance for transaction'
  }

  // Network/connection errors
  if (lowerMessage.includes('network error') ||
      lowerMessage.includes('connection failed') ||
      lowerMessage.includes('timeout') ||
      lowerMessage.includes('fetch failed') ||
      lowerMessage.includes('failed to fetch')) {
    return 'Network connection error. Please check your internet connection'
  }

  // Gas related errors
  if (lowerMessage.includes('gas') ||
      lowerMessage.includes('out of gas') ||
      lowerMessage.includes('gas limit')) {
    return 'Transaction requires more gas. Please try again with higher gas limit'
  }

  // Invalid input errors
  if (lowerMessage.includes('invalid address') ||
      lowerMessage.includes('invalid recipient') ||
      lowerMessage.includes('invalid amount') ||
      lowerMessage.includes('invalid input')) {
    return 'Invalid transaction details. Please check your input'
  }

  // Token/contract errors
  if (lowerMessage.includes('token') ||
      lowerMessage.includes('contract') ||
      lowerMessage.includes('unsupported')) {
    return 'Token not supported or contract error'
  }

  // Wallet connection errors
  if (lowerMessage.includes('wallet') ||
      lowerMessage.includes('not connected') ||
      lowerMessage.includes('no provider')) {
    return 'Wallet connection error. Please connect your wallet'
  }

  // Return original message if no pattern matches
  return errorMessage
}

/**
 * Categorize errors into types for handling
 * @param error - The raw error to categorize
 * @returns Error category
 */
export function categorizeError(error: unknown): ErrorCategory {
  const message = parseError(error).toLowerCase()

  if (message.includes('cancelled by user') || message.includes('rejected')) {
    return 'USER_REJECTED'
  }
  if (message.includes('insufficient')) {
    return 'INSUFFICIENT_FUNDS'
  }
  if (message.includes('network') || message.includes('connection')) {
    return 'NETWORK_ERROR'
  }
  if (message.includes('token') || message.includes('unsupported')) {
    return 'UNSUPPORTED_TOKEN'
  }
  if (message.includes('invalid')) {
    return 'INVALID_INPUT'
  }
  
  return 'UNKNOWN_ERROR'
}

/**
 * Create a structured error object with category and user message
 * @param error - The raw error
 * @returns Structured error information
 */
export function createParsedError(error: unknown): ParsedError {
  const message = parseError(error)
  const category = categorizeError(error)

  return {
    category,
    message,
    originalError: error,
  }
}