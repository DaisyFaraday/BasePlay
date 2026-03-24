export interface MatchInfo {
  poolId: number;
  matchTitle: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  description?: string;
  logo?: string;
  createdAt: number;
  txHash?: string;
}

export interface PoolWithMatch {
  poolId: number;
  startTime: bigint;
  endTime: bigint;
  token: string;
  feeBps: number;
  status: number;
  totalPool: bigint;
  homeAmount: bigint;
  drawAmount: bigint;
  awayAmount: bigint;
  matchInfo?: MatchInfo;
}
