import { useEffect, useState } from 'react'
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import { formatEther } from 'viem'
import type { WalletState } from '../core/types'

interface BitkeepWindow {
  bitkeep?: {
    ethereum?: any
  }
}

export function useBitgetWallet(): WalletState {
  const [isMounted, setIsMounted] = useState(false)
  const { address, isConnected, chainId } = useAccount()
  const { data: balanceData } = useBalance({ address })
  const { connectAsync, connectors } = useConnect()
  const { disconnect: wagmiDisconnect } = useDisconnect()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const detectBitgetWallet = (): boolean => {
    if (typeof globalThis === 'undefined') return false
    const globalWindow = (globalThis as any).window as BitkeepWindow | undefined
    if (!globalWindow) return false
    return !!(globalWindow.bitkeep?.ethereum)
  }

  const getBitgetConnector = () => {
    const bitgetConnector = connectors.find(
      (connector) => connector.id.includes('bitget') || connector.id.includes('bitkeep')
    )
    return bitgetConnector || connectors.find((connector) => connector.id === 'injected')
  }

  const connect = async (): Promise<void> => {
    if (!isMounted) return
    try {
      const connector = getBitgetConnector()
      if (!connector) {
        throw new Error('Bitget Wallet or generic injected connector not found.')
      }
      await connectAsync({ connector })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  const disconnect = async (): Promise<void> => {
    try {
      await wagmiDisconnect()
      try {
        if (typeof globalThis !== 'undefined') {
          const localStorage = (globalThis as any).localStorage
          const sessionStorage = (globalThis as any).sessionStorage
          if (localStorage) {
            localStorage.removeItem('wagmi.store')
            localStorage.removeItem('wagmi.cache')
          }
          if (sessionStorage) {
            sessionStorage.removeItem('wagmi.store')
            sessionStorage.removeItem('wagmi.cache')
          }
        }
      } catch (storageError) {
        console.warn('Failed to clear wallet storage:', storageError)
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      try {
        if (typeof globalThis !== 'undefined') {
          const globalWindow = (globalThis as any).window
          if (globalWindow?.location?.reload) {
            globalWindow.location.reload()
          }
        }
      } catch (reloadError) {
        console.error('Failed to reload page:', reloadError)
      }
      throw error
    }
  }

  return {
    isConnected,
    address,
    chainId,
    balance: balanceData?.value ? formatEther(balanceData.value) : undefined,
    connect,
    disconnect,
  }
}