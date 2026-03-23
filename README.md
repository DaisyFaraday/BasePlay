# BasePlay

**Predict games, win the pool** — A decentralized sports prediction app on Base where users predict match outcomes and winners split the prize pool.

## 🎯 Overview

BasePlay is a parimutuel betting platform built on Base blockchain. Users predict sports match outcomes (Home Win, Draw, Away Win), stake ETH, and winners split the total prize pool proportionally to their stakes.

### Key Features

- 🎲 **Pool-based Betting** - Parimutuel system with fair odds
- ⛓️ **On-Chain** - All predictions verified on Base blockchain
- 🏆 **Leaderboard** - Track top predictors
- 🔐 **Admin Panel** - Create and resolve pools
- 📱 **Mobile-First** - Optimized for mobile Base app

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi, viem, RainbowKit
- **Blockchain**: Base (Chain ID: 8453)
- **Contract**: `0xf5f96916b2c13f060b4579a4eb6cc9d91ca6dff2`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A WalletConnect Project ID (get one at [cloud.walletconnect.com](https://cloud.walletconnect.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DaisyFaraday/BasePlay.git
cd BasePlay
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your configuration:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page with pool list
│   ├── pools/[id]/        # Pool detail page
│   ├── my-bets/           # User's betting history
│   ├── leaderboard/       # Top predictors
│   └── admin/             # Admin panel
├── components/            # React components
│   └── Providers.tsx      # Web3 providers setup
├── config/                # Configuration files
│   └── app.ts            # App & contract config
└── lib/                   # Utilities
    └── abi/              # Contract ABIs
        └── basePlay.ts   # BasePlay contract ABI
```

## 🌐 Environment Variables

### Public Variables (Safe to expose)
- `NEXT_PUBLIC_APP_NAME` - App name
- `NEXT_PUBLIC_APP_URL` - Production URL
- `NEXT_PUBLIC_BASE_APP_ID` - Base app identifier
- `NEXT_PUBLIC_BUILDER_CODE` - Builder code (bc_ompx7u9z)
- `NEXT_PUBLIC_CHAIN_ID` - Blockchain network (8453 = Base)
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Smart contract address
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect config

### Private Variables (NEVER commit)
- `ADMIN_WALLET` - Admin address for contract management
- `ORACLE_API_KEY` - (Future) Automated oracle integration

## 📄 Contract Functions

### Read Functions
- `getAllPools()` - Get all prediction pools
- `getPool(poolId)` - Get specific pool details
- `getUserBets(address)` - Get user's betting history
- `owner()` - Get contract owner

### Write Functions
- `placeBet(poolId, prediction)` - Place a bet (payable)
- `claimReward(poolId)` - Claim winnings
- `createPool(matchName)` - Create new pool (admin only)
- `resolvePool(poolId, result)` - Resolve outcome (admin only)

## 🚢 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login and deploy:
```bash
vercel login
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - Add all `NEXT_PUBLIC_*` variables
   - Add private variables (admin wallet, etc.)

### Base.dev Submission

**App Information:**
- **Name**: BasePlay
- **Tagline**: Predict games, win the pool
- **Description**: A decentralized sports prediction app on Base where users predict match outcomes and winners split the prize pool.
- **Category**: GameFi / SocialFi / Prediction
- **Builder Code**: bc_ompx7u9z
- **Base App ID**: 69c0b55d3beb94a927e63d55
- **Contract**: 0xf5f96916b2c13f060b4579a4eb6cc9d91ca6dff2

## 🔐 Security Notes

⚠️ **NEVER commit to git:**
- `.env.local` file
- Private keys or admin credentials
- API keys or secrets

✅ **Safe to commit:**
- `.env.local.example` (template)
- Public configuration
- Contract addresses and ABIs

## 📱 Base App Integration

This app includes required Base.dev metadata tags:
```html
<meta name="base:app_id" content="69c0b55d3beb94a927e63d55" />
<meta name="talentapp:project_verification" content="4a7fa9b0d878fcc46a71871a111b21cadbbb0f420867fb883105a57d0e39cf183bf1ff06ba079dbd84a8a61e9795e4ebfd7b9203fcba763ca57c378d758aaa97" />
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **GitHub**: https://github.com/DaisyFaraday/BasePlay
- **Builder Code**: bc_ompx7u9z
- **Contract**: [0xf5f96916b2c13f060b4579a4eb6cc9d91ca6dff2](https://basescan.org/address/0xf5f96916b2c13f060b4579a4eb6cc9d91ca6dff2)

---

Built with ❤️ on Base
