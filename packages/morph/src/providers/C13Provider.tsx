'use client'

import React from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected } from 'wagmi/connectors'
import type { Config } from 'wagmi'
import { MorphMainnet, MorphHoodiTestnet } from '../chains'

export interface C13ProviderProps {
  children: React.ReactNode
  config?: Config
  queryClient?: QueryClient
}

// Default wagmi config with Morph chains and explicit RPC URLs
const defaultConfig = createConfig({
  chains: [MorphMainnet, MorphHoodiTestnet],
  connectors: [
    injected({
      target: 'bitKeep',
    }),
    injected(),
  ],
  transports: {
    [MorphMainnet.id]: http('https://rpc-quicknode.morphl2.io'),
    [MorphHoodiTestnet.id]: http('https://rpc-hoodi.morphl2.io'),
  },
})

// Default React Query client with SSR-safe settings
const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      // Prevent hydration mismatches
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
})

export function C13Provider({ 
  children, 
  config = defaultConfig, 
  queryClient = defaultQueryClient 
}: C13ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}