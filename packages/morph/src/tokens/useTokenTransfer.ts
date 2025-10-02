import { useState } from 'react'
import { useAccount, useSendTransaction, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, isAddress } from 'viem'
import { MORPH_TOKENS, ERC20_ABI, type TokenSymbol, type ChainId } from './constants'

export interface TransferParams {
  to: string
  amount: string
  token: TokenSymbol | string // Symbol or contract address
  chainId?: ChainId
}

export interface UseTokenTransferParams {
  onSuccess?: (txHash: string) => void
  onError?: (error: Error) => void
}

export interface TokenTransferResult {
  transfer: (params: TransferParams) => Promise<string>
  isLoading: boolean
  error: Error | null
  txHash?: string
  isConfirming: boolean
  isConfirmed: boolean
}

export function useTokenTransfer({
  onSuccess,
  onError
}: UseTokenTransferParams = {}): TokenTransferResult {
  const { chainId: connectedChainId } = useAccount()
  const [txHash, setTxHash] = useState<string | undefined>()
  const [currentError, setCurrentError] = useState<Error | null>(null)

  // ETH transfer hook
  const {
    sendTransaction: sendETH,
    isPending: isETHPending,
    error: ethError,
    data: ethTxHash
  } = useSendTransaction()

  // ERC-20 transfer hook
  const {
    writeContract: writeERC20,
    isPending: isERC20Pending,
    error: erc20Error,
    data: erc20TxHash
  } = useWriteContract()

  // Transaction confirmation hook
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed
  } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  })

  // Validation functions
  const validateTransferParams = (params: TransferParams): void => {
    const { to, amount, token } = params

    if (!to || !isAddress(to)) {
      throw new Error('Invalid recipient address')
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      throw new Error('Invalid amount')
    }

    if (!token) {
      throw new Error('Token is required')
    }
  }

  // Get token info helper
  const getTokenInfo = (token: string, chainId: ChainId) => {
    if (isAddress(token)) {
      // Custom contract address
      return {
        address: token,
        symbol: 'UNKNOWN',
        decimals: 18,
        isNative: false
      }
    } else {
      // Token symbol
      const chainTokens = MORPH_TOKENS[chainId]
      const tokenInfo = chainTokens?.[token as TokenSymbol]
      
      if (!tokenInfo) {
        throw new Error(`Unsupported token: ${token}`)
      }

      return {
        ...tokenInfo,
        isNative: token === 'ETH' || tokenInfo.address === '0x0000000000000000000000000000000000000000'
      }
    }
  }

  // Main transfer function
  const transfer = async (params: TransferParams): Promise<string> => {
    try {
      setCurrentError(null)
      setTxHash(undefined)

      // Validate parameters
      validateTransferParams(params)

      const { to, amount, token, chainId } = params
      const targetChainId = (chainId || connectedChainId) as ChainId

      if (!targetChainId) {
        throw new Error('Chain ID not available')
      }

      // Get token information
      const tokenInfo = getTokenInfo(token, targetChainId)

      if (tokenInfo.isNative) {
        // ETH transfer
        const value = parseUnits(amount, tokenInfo.decimals)
        
        sendETH({
          to: to as `0x${string}`,
          value,
          chainId: targetChainId
        })

        // Return a promise that resolves when the transaction is submitted
        return new Promise((resolve, reject) => {
          const checkForHash = () => {
            if (ethTxHash) {
              setTxHash(ethTxHash)
              onSuccess?.(ethTxHash)
              resolve(ethTxHash)
            } else if (ethError) {
              reject(ethError)
            } else {
              // Keep checking
              setTimeout(checkForHash, 100)
            }
          }
          checkForHash()
        })
      } else {
        // ERC-20 transfer
        const value = parseUnits(amount, tokenInfo.decimals)
        
        writeERC20({
          address: tokenInfo.address as `0x${string}`,
          abi: [
            {
              constant: false,
              inputs: [
                { name: '_to', type: 'address' },
                { name: '_value', type: 'uint256' }
              ],
              name: 'transfer',
              outputs: [{ name: '', type: 'bool' }],
              type: 'function'
            }
          ],
          functionName: 'transfer',
          args: [to as `0x${string}`, value],
          chainId: targetChainId
        })

        // Return a promise that resolves when the transaction is submitted
        return new Promise((resolve, reject) => {
          const checkForHash = () => {
            if (erc20TxHash) {
              setTxHash(erc20TxHash)
              onSuccess?.(erc20TxHash)
              resolve(erc20TxHash)
            } else if (erc20Error) {
              reject(erc20Error)
            } else {
              // Keep checking
              setTimeout(checkForHash, 100)
            }
          }
          checkForHash()
        })
      }
    } catch (error) {
      const transferError = error as Error
      setCurrentError(transferError)
      onError?.(transferError)
      throw transferError
    }
  }

  // Determine loading state
  const isLoading = isETHPending || isERC20Pending

  // Determine error state
  const error = currentError || ethError || erc20Error

  return {
    transfer,
    isLoading,
    error: error as Error | null,
    txHash,
    isConfirming,
    isConfirmed
  }
}
