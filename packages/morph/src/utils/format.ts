/**
 * Format balance for display with proper decimal places
 * @param balance - The balance as string, bigint, or undefined
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted balance string
 */
export function formatBalance(
  balance: string | bigint | undefined, 
  decimals: number = 2
): string {
  if (balance === undefined || balance === null) {
    return '0.00'
  }

  let numericBalance: number

  if (typeof balance === 'bigint') {
    // Convert bigint to number (may lose precision for very large numbers)
    numericBalance = Number(balance)
  } else if (typeof balance === 'string') {
    const parsed = parseFloat(balance)
    if (isNaN(parsed)) {
      return '0.00'
    }
    numericBalance = parsed
  } else {
    return '0.00'
  }

  // Handle zero or very small numbers
  if (numericBalance === 0) {
    if (decimals === 0) {
      return '0'
    }
    return '0.' + '0'.repeat(decimals)
  }

  // Format with specified decimal places
  return numericBalance.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format Ethereum address for display (shortened format)
 * @param address - The full Ethereum address
 * @param chars - Number of characters to show at start/end (default: 4)
 * @returns Shortened address in format "0x1234...5678"
 */
export function formatAddress(
  address: string | undefined, 
  chars: number = 4
): string {
  if (!address) {
    return '0x0000…0000'
  }

  // Validate address format - must start with 0x and be valid length
  if (!address.startsWith('0x')) {
    return '0x0000…0000'
  }
  
  // Allow shorter addresses for testing, but they should still be valid hex
  if (address.length < 10) { // Minimum reasonable length
    return '0x0000…0000'
  }

  // Ensure chars is reasonable
  const safeChars = Math.max(1, Math.min(chars, 20))
  
  // If address is short enough, return as-is
  // Need at least 2 (0x) + safeChars + 1 (…) + safeChars characters to make sense to shorten
  if (address.length <= 2 + (safeChars * 2) + 3) {
    return address
  }

  const start = address.slice(0, 2 + safeChars) // 0x + chars
  const end = address.slice(-safeChars) // last chars
  
  return `${start}…${end}`
}

/**
 * Format token amount with symbol for display
 * @param amount - The token amount
 * @param symbol - The token symbol
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted amount with symbol
 */
export function formatTokenAmount(
  amount: string | bigint | undefined,
  symbol: string,
  decimals: number = 2
): string {
  const formattedAmount = formatBalance(amount, decimals)
  return `${formattedAmount} ${symbol}`
}

/**
 * Format large numbers with K, M, B suffixes
 * @param value - The numeric value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number with suffix
 */
export function formatCompactNumber(
  value: number | string | undefined,
  decimals: number = 1
): string {
  if (value === undefined || value === null) {
    return '0'
  }

  const num = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(num)) {
    return '0'
  }

  if (num === 0) {
    return '0'
  }

  const absNum = Math.abs(num)
  const sign = num < 0 ? '-' : ''

  if (absNum >= 1e9) {
    return `${sign}${(absNum / 1e9).toFixed(decimals)}B`
  } else if (absNum >= 1e6) {
    return `${sign}${(absNum / 1e6).toFixed(decimals)}M`
  } else if (absNum >= 1e3) {
    return `${sign}${(absNum / 1e3).toFixed(decimals)}K`
  } else {
    return `${sign}${absNum.toFixed(decimals)}`
  }
}

/**
 * Format percentage for display
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number | string | undefined,
  decimals: number = 2
): string {
  if (value === undefined || value === null) {
    return '0.00%'
  }

  const num = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(num)) {
    return '0.00%'
  }

  return `${num.toFixed(decimals)}%`
}
