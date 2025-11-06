# AccountantBot - Setup Guide

## 🚀 Quick Start

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:
- `VITE_API_URL`: Your backend API URL
- `VITE_CONTRACT_ADDRESS`: SplitCoordinator contract address on Scroll
- `VITE_WALLETCONNECT_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

## 📋 Features

### Authentication
- **SIWE (Sign-In With Ethereum)**: Secure wallet-based authentication
- **Telegram Integration**: Link Telegram username for notifications

### Dashboard Tabs

#### 1. Approve Debts
- View pending payments that require your approval
- Sign gasless approvals using EIP-712
- No transaction fees for participants

#### 2. My Splits
- View splits you've created
- Track approval progress
- Settle payments on-chain

#### 3. Allowances
- Manage ERC-20 token allowances
- Set spending limits for the SplitCoordinator contract
- Support for USDC, USDT, and other tokens

#### 4. Bridge
- Integrated LI.FI bridge widget
- Transfer assets to Scroll network
- Optimized for USDC deposits

### Create Split
- Add multiple participants
- Set individual amounts or split equally
- Support for multiple ERC-20 tokens
- Real-time validation

### History
- View all past transactions
- Filter by status
- Direct links to Scrollscan explorer

## 🏗️ Architecture

### Frontend Stack
- **React 18** with **Vite**
- **TypeScript** for type safety
- **TailwindCSS** + **shadcn/ui** for styling
- **wagmi** + **viem** for Web3 interactions
- **RainbowKit** for wallet connections

### Web3 Integration
- **Network**: Scroll (Layer 2)
- **Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, etc.
- **EIP-712**: Gasless signature approvals
- **ERC-20**: Multi-token support

## 🎨 Design System

The app uses a custom Web3-themed design:
- **Colors**: Deep blue to cyan gradient
- **Effects**: Glassmorphism cards with backdrop blur
- **Animations**: Smooth transitions and hover effects
- **Typography**: Inter font family

## 🔒 Security

- **Non-custodial**: Users maintain control of their funds
- **Allowance-based**: Explicit permission for token spending
- **EIP-712**: Industry-standard typed data signing
- **Frontend-only**: No sensitive keys in client code

## 📱 Mobile Responsive

All components are fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing

The app includes mock API integration. Ensure your backend implements:
- `/auth/siwe/*` - Authentication endpoints
- `/tokens` - Token list
- `/splits` - Split management
- `/users/me/allowance` - Allowance queries

## 🚢 Deployment

1. Build for production:
```bash
npm run build
```

2. Preview production build:
```bash
npm run preview
```

3. Deploy the `dist` folder to your hosting service

## 📚 Additional Resources

- [Scroll Documentation](https://docs.scroll.io/)
- [wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712)

## 🤝 Support

For issues or questions:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure wallet is connected to Scroll network
4. Confirm backend API is running and accessible
