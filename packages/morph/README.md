# @c13/morph-sdk

A professional TypeScript SDK for building applications on the Morph blockchain with seamless wallet integration and comprehensive payment functionality.

## Features

- 🔗 **Wallet Integration** - Connect to Bitget and other popular wallets
- 💰 **Token Operations** - Handle ETH, USDT, USDC, and custom tokens
- 🔄 **Token Transfers** - Send payments with built-in validation
- 🌐 **Morph Network** - Full support for Morph Mainnet and Testnet
- ⚡ **React Hooks** - Ready-to-use hooks for React applications
- 🛡️ **Type Safety** - Full TypeScript support with strict typing
- 🧪 **Well Tested** - Comprehensive test coverage
- 🔒 **React 18 Compatible** - Optimized for React 18 with automatic compatibility checks
- 🎨 **Test App Included** - Complete demo application showing all features

## Requirements

- **Node.js**: 18.0.0 or higher
- **React**: 18.3.1 or higher (React 19 not supported)
- **TypeScript**: 5.0.0 or higher (recommended)

## Installation

```bash
npm install @c13/morph-sdk
# or
yarn add @c13/morph-sdk
# or
pnpm add @c13/morph-sdk
```

### React Compatibility

This SDK requires **React 18**. If you're using React 19, please downgrade:

```bash
npm install react@18.3.1 react-dom@18.3.1 @types/react@18.3.11 @types/react-dom@18.3.6
```

For automatic React 18 setup, run:

```bash
node node_modules/@c13/morph-sdk/scripts/check-react-compatibility.js
```

## Test App

The SDK includes a complete test application that demonstrates all features:

### Running the Test App

```bash
# Navigate to your node_modules
cd node_modules/@c13/morph-sdk/test-app

# Install dependencies
pnpm install

# Start the test app
pnpm dev
```

Or use the convenience scripts from the main SDK:

```bash
# From your project root
npx @c13/morph-sdk test-app:install
npx @c13/morph-sdk test-app:dev
```

### Test App Features

- 🔗 **Wallet Connection** - Connect and manage Bitget wallet
- ⛓️ **Network Selection** - Switch between Morph Mainnet and Testnet  
- 💰 **Token Balances** - View ETH, USDT, USDC, and BGB balances
- 🛠️ **SDK Utilities** - Demonstrate formatting and error handling functions
- 🎨 **Modern UI** - Dark theme with C13 brand colors and Courier New font

## Quick Start

### 1. Setup Provider

Wrap your application with the C13Provider:

```tsx
import { C13Provider } from '@c13/morph-sdk'

function App() {
  return (
    <C13Provider>
      <YourApp />
    </C13Provider>
  )
}
```

### 2. Connect Wallet

```tsx
import { useBitgetWallet } from '@c13/morph-sdk'

function WalletConnection() {
  const { isConnected, address, connect, disconnect } = useBitgetWallet()

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  )
}
```

### 3. Check Token Balance

```tsx
import { useTokenBalance, formatBalance } from '@c13/morph-sdk'

function TokenBalance() {
  const { balance, isLoading, error } = useTokenBalance({ token: 'ETH' })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading balance</div>

  return <div>Balance: {formatBalance(balance)} ETH</div>
}
```

### 4. Send Tokens

```tsx
import { useTokenTransfer } from '@c13/morph-sdk'

function SendTokens() {
  const { transfer, isLoading } = useTokenTransfer({
    onSuccess: (txHash) => console.log('Transfer successful:', txHash),
    onError: (error) => console.error('Transfer failed:', error),
  })

  const handleSend = async () => {
    await transfer({
      to: '0x742d35Cc6634C0532925a3b8D0C9e3e742d35Cc6',
      amount: '0.1',
      token: 'ETH',
    })
  }

  return (
    <button onClick={handleSend} disabled={isLoading}>
      {isLoading ? 'Sending...' : 'Send 0.1 ETH'}
    </button>
  )
}
```

## API Reference

### Hooks

- `useBitgetWallet()` - Wallet connection and management
- `useTokenBalance(params)` - Token balance queries
- `useTokenTransfer(options)` - Token transfer operations

### Components

- `<C13Provider>` - Context provider for SDK functionality

### Utilities

- `formatBalance(balance, decimals?)` - Format token balances
- `formatAddress(address, chars?)` - Shorten wallet addresses
- `parseError(error)` - Parse and format error messages

### Chain Configurations

- `MorphMainnet` - Morph Mainnet configuration
- `MorphHoodiTestnet` - Morph Testnet configuration

## Supported Tokens

| Token | Mainnet | Testnet |
|-------|---------|---------|
| ETH   | ✅      | ✅      |
| USDT  | ✅      | ✅      |
| USDC  | ✅      | ✅      |
| BGB   | ✅      | ✅      |

## Troubleshooting

### React Version Conflicts

If you encounter React version conflicts:

1. **Check your React version**:
   ```bash
   npm list react react-dom
   ```

2. **Force React 18**:
   ```bash
   npm install react@18.3.1 react-dom@18.3.1 --save-exact
   ```

3. **Add to package.json**:
   ```json
   {
     "overrides": {
       "react": "18.3.1",
       "react-dom": "18.3.1"
     },
     "resolutions": {
       "react": "18.3.1",
       "react-dom": "18.3.1"
     }
   }
   ```

4. **Create .npmrc**:
   ```
   legacy-peer-deps=true
   save-exact=true
   ```

### Common Issues

- **"Invalid hook call"**: Usually caused by multiple React versions. Follow React version conflict resolution above.
- **"Cannot read properties of null"**: Ensure you're using the `<C13Provider>` wrapper.
- **Network errors**: Check your internet connection and RPC endpoints.
- **"Chain not configured"**: Make sure you're connected to Morph Mainnet (2818) or Testnet (2910).

## Examples

The included test app provides complete examples of:

- Basic wallet integration
- Token balance queries
- Multi-token dashboard
- Network switching
- Error handling
- Utility function usage

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the package
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format

# Run test app
pnpm test-app:dev
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT © C13 Development Team

## Support

- 📖 [Documentation](./docs)
- 🎨 [Test App](./test-app) - Live demo of all features
- 🐛 [Issue Tracker](https://github.com/c13/morph-sdk/issues)
- 💬 [Discussions](https://github.com/c13/morph-sdk/discussions)