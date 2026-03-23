export const APP_CONFIG = {
  name: 'BasePlay',
  tagline: 'Predict games, win the pool',
  description: 'A decentralized sports prediction app on Base where users predict match outcomes and winners split the prize pool.',
  baseAppId: '69c0b55d3beb94a927e63d55',
  builderCode: 'bc_ompx7u9z',
  projectIdentifier: '0x62635f6f6d70783775397a0b0080218021802180218021802180218021',
  verificationMeta: {
    baseAppId: '69c0b55d3beb94a927e63d55',
    talentappVerification: '4a7fa9b0d878fcc46a71871a111b21cadbbb0f420867fb883105a57d0e39cf183bf1ff06ba079dbd84a8a61e9795e4ebfd7b9203fcba763ca57c378d758aaa97'
  },
  categories: ['GameFi', 'SocialFi', 'Prediction'],
  features: {
    leaderboard: true,
    socialShare: true,
    inviteRewards: false,
    oracle: true,
    adminPanel: true
  }
} as const;

export const CONTRACT_CONFIG = {
  address: '0xf5f96916b2c13f060b4579a4eb6cc9d91ca6dff2' as `0x${string}`,
  chainId: 8453, // Base mainnet
  adminWallet: '0x0E219ce4F91e6c2394519733Aa210c0de8Ea8b19' as `0x${string}`,
  resolverWallet: '0x0E219ce4F91e6c2394519733Aa210c0de8Ea8b19' as `0x${string}`,
  defaultCurrency: 'ETH'
} as const;
