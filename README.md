# C13 SDK Collection

Multi-chain SDKs for building Web3 applications on various blockchains.

## 📦 Available Packages

### [@c13/morph](./packages/morph)
TypeScript SDK for building applications on Morph blockchain with seamless Bitget Wallet integration.

**Features:**
- 🔐 Bitget Wallet integration
- 💰 Multi-token support (ETH, USDT, USDC, BGB)
- ⚡ Built on viem & wagmi
- 🎨 React hooks for wallet & token operations
- 🔄 Real-time balance tracking
- 📱 Mobile-friendly

**Installation:**
```bash
npm install @c13/morph
# or
pnpm add @c13/morph
```

**Quick Start:**
```tsx
import { C13Provider, useBitgetWallet } from '@c13/morph'

function App() {
  return (
    <C13Provider>
      <YourApp />
    </C13Provider>
  )
}

function YourApp() {
  const { connect, address, isConnected } = useBitgetWallet()
  
  return (
    <button onClick={connect}>
      {isConnected ? address : 'Connect Wallet'}
    </button>
  )
}
```

---

## 🚀 Coming Soon

- **@c13/solana** - Solana SDK with Phantom Wallet
- **@c13/ethereum** - Ethereum SDK with MetaMask
- **@c13/sei** - Sei Network SDK

---

## 🏗️ Development

This is a monorepo managed with pnpm workspaces.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Development mode
pnpm dev
```

---

## 📚 Documentation

- [Morph SDK Documentation](./packages/morph/README.md)
- [Contributing Guide](./CONTRIBUTING.md)

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

---

## 🔗 Links

- [Website](https://c13.studio)
- [GitHub](https://github.com/c13studio/c13-sdk)
- [Issues](https://github.com/c13studio/c13-sdk/issues)

---

Built with ❤️ by [C13 Studio](https://github.com/c13studio)

