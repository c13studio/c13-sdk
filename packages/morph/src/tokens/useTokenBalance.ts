import { useAccount, useBalance, useReadContract } from 'wagmi'
import { formatUnits, isAddress } from 'viem'
import { MORPH_TOKENS, ERC20_ABI, type TokenSymbol, type ChainId } from './constants'

export interface TokenBalanceResult {
  balance: string | undefined
  symbol: string
  decimals: number
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export interface UseTokenBalanceParams {
  token: TokenSymbol | string // Symbol or contract address
  address?: string // User address (optional, uses connected wallet if not provided)
  chainId?: ChainId // Chain ID (optional, uses current chain if not provided)
  enabled?: boolean // Enable/disable the query
}

export function useTokenBalance({
  token,
  address: userAddress,
  chainId,
  enabled = true
}: UseTokenBalanceParams): TokenBalanceResult {
  const { address: connectedAddress, chainId: connectedChainId } = useAccount()
  
  // Use provided address or connected wallet address
  const targetAddress = userAddress || connectedAddress
  
  // Use provided chainId or connected chain
  const targetChainId = (chainId || connectedChainId) as ChainId
  
  // Determine if token is ETH or ERC-20
  const isNativeETH = token === 'ETH' || token === '0x0000000000000000000000000000000000000000'
  
  // Get token info
  const getTokenInfo = () => {
    if (isAddress(token)) {
      // Custom contract address provided
      return {
        address: token,
        symbol: 'UNKNOWN',
        decimals: 18,
        name: 'Unknown Token'
      }
    } else {
      // Token symbol provided
      const chainTokens = MORPH_TOKENS[targetChainId]
      return chainTokens?.[token as TokenSymbol] || {
        address: '0x0000000000000000000000000000000000000000',
        symbol: token,
        decimals: 18,
        name: token
      }
    }
  }
  
  const tokenInfo = getTokenInfo()
  
  // Native ETH balance query
  const {
    data: ethBalance,
    isLoading: ethLoading,
    error: ethError,
    refetch: ethRefetch
  } = useBalance({
    address: targetAddress as `0x${string}` | undefined,
    chainId: targetChainId,
    query: {
      enabled: enabled && isNativeETH && !!targetAddress
    }
  })
  
  // ERC-20 token balance query
  const {
    data: tokenBalance,
    isLoading: tokenLoading,
    error: tokenError,
    refetch: tokenRefetch
  } = useReadContract({
    address: tokenInfo.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: targetAddress ? [targetAddress as `0x${string}`] : undefined,
    chainId: targetChainId,
    query: {
      enabled: enabled && !isNativeETH && !!targetAddress && !!tokenInfo.address
    }
  })
  
  // Format balance based on token type
  const formatBalance = () => {
    if (isNativeETH && ethBalance) {
      return formatUnits(ethBalance.value, ethBalance.decimals)
    } else if (!isNativeETH && tokenBalance) {
      return formatUnits(tokenBalance as bigint, tokenInfo.decimals)
    }
    return undefined
  }
  
  // Determine loading state
  const isLoading = isNativeETH ? ethLoading : tokenLoading
  
  // Determine error state
  const error = (isNativeETH ? ethError : tokenError) as Error | null
  
  // Refetch function
  const refetch = () => {
    if (isNativeETH) {
      ethRefetch()
    } else {
      tokenRefetch()
    }
  }
  
  return {
    balance: formatBalance(),
    symbol: tokenInfo.symbol,
    decimals: tokenInfo.decimals,
    isLoading,
    error,
    refetch
  }
}
