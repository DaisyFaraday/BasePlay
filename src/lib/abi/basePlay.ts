export const BASE_PLAY_ABI = [
  {
    "inputs": [],
    "name": "getAllPools",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "poolId", "type": "uint256" },
          { "internalType": "string", "name": "matchName", "type": "string" },
          { "internalType": "uint256", "name": "totalPool", "type": "uint256" },
          { "internalType": "uint8", "name": "status", "type": "uint8" },
          { "internalType": "uint8", "name": "result", "type": "uint8" },
          { "internalType": "uint256", "name": "homeAmount", "type": "uint256" },
          { "internalType": "uint256", "name": "awayAmount", "type": "uint256" },
          { "internalType": "uint256", "name": "drawAmount", "type": "uint256" }
        ],
        "internalType": "struct BasePlay.Pool[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "poolId", "type": "uint256" }],
    "name": "getPool",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "poolId", "type": "uint256" },
          { "internalType": "string", "name": "matchName", "type": "string" },
          { "internalType": "uint256", "name": "totalPool", "type": "uint256" },
          { "internalType": "uint8", "name": "status", "type": "uint8" },
          { "internalType": "uint8", "name": "result", "type": "uint8" },
          { "internalType": "uint256", "name": "homeAmount", "type": "uint256" },
          { "internalType": "uint256", "name": "awayAmount", "type": "uint256" },
          { "internalType": "uint256", "name": "drawAmount", "type": "uint256" }
        ],
        "internalType": "struct BasePlay.Pool",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "poolId", "type": "uint256" },
      { "internalType": "uint8", "name": "prediction", "type": "uint8" }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserBets",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "poolId", "type": "uint256" },
          { "internalType": "uint8", "name": "prediction", "type": "uint8" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "bool", "name": "claimed", "type": "bool" }
        ],
        "internalType": "struct BasePlay.Bet[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "poolId", "type": "uint256" }],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "matchName", "type": "string" }],
    "name": "createPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "poolId", "type": "uint256" },
      { "internalType": "uint8", "name": "result", "type": "uint8" }
    ],
    "name": "resolvePool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "matchName", "type": "string" }
    ],
    "name": "PoolCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "prediction", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256" },
      { "indexed": false, "internalType": "uint8", "name": "result", "type": "uint8" }
    ],
    "name": "PoolResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "RewardClaimed",
    "type": "event"
  }
] as const;
