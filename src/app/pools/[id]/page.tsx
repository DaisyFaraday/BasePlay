'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/app';
import { BASE_PLAY_ABI } from '@/lib/abi/basePlay';
import { parseEther } from 'viem';
import { useState } from 'react';
import Link from 'next/link';
import { use } from 'react';

export default function PoolDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const poolId = BigInt(id);
  const { address } = useAccount();
  const [betAmount, setBetAmount] = useState('0.01');
  const [selectedPrediction, setSelectedPrediction] = useState<number>(0);

  const { data: pool } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: BASE_PLAY_ABI,
    functionName: 'getPool',
    args: [poolId],
    chainId: CONTRACT_CONFIG.chainId,
  });

  const { data: userBets } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: BASE_PLAY_ABI,
    functionName: 'getUserBets',
    args: [address as `0x${string}`],
    chainId: CONTRACT_CONFIG.chainId,
    query: { enabled: !!address },
  });

  const { writeContract, isPending } = useWriteContract();

  const handlePlaceBet = () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }
    writeContract({
      address: CONTRACT_CONFIG.address,
      abi: BASE_PLAY_ABI,
      functionName: 'placeBet',
      args: [poolId, selectedPrediction],
      value: parseEther(betAmount),
    });
  };

  if (!pool) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading pool data...</div>
      </main>
    );
  }

  const totalEth = Number(pool.totalPool) / 1e18;
  const statusLabels = ['Open for Bets', 'Locked', 'Resolved'];
  const predictionLabels = ['Home Win', 'Draw', 'Away Win'];

  const myBetsForThisPool = userBets?.filter((bet: any) => bet.poolId === poolId) || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition">
            ← BasePlay
          </Link>
          <ConnectButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">{pool.matchName}</h1>
              <p className="text-gray-400">Pool #{id}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              pool.status === 0 ? 'bg-green-500/20 text-green-400' :
              pool.status === 1 ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {statusLabels[pool.status]}
            </span>
          </div>

          <div className="bg-black/30 rounded-xl p-6 mb-6">
            <div className="text-center mb-2">
              <span className="text-gray-400 text-sm">Total Prize Pool</span>
            </div>
            <div className="text-5xl font-bold text-white text-center">
              {totalEth.toFixed(4)} ETH
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <div className="text-green-400 text-lg font-bold mb-1">Home Win</div>
              <div className="text-white text-2xl font-extrabold">{(Number(pool.homeAmount) / 1e18).toFixed(3)}</div>
              <div className="text-gray-400 text-xs">ETH</div>
            </div>
            <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-4 text-center">
              <div className="text-gray-300 text-lg font-bold mb-1">Draw</div>
              <div className="text-white text-2xl font-extrabold">{(Number(pool.drawAmount) / 1e18).toFixed(3)}</div>
              <div className="text-gray-400 text-xs">ETH</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <div className="text-red-400 text-lg font-bold mb-1">Away Win</div>
              <div className="text-white text-2xl font-extrabold">{(Number(pool.awayAmount) / 1e18).toFixed(3)}</div>
              <div className="text-gray-400 text-xs">ETH</div>
            </div>
          </div>

          {pool.status === 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Place Your Bet</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Select Prediction</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((pred) => (
                      <button
                        key={pred}
                        onClick={() => setSelectedPrediction(pred)}
                        className={`py-3 px-4 rounded-lg font-semibold transition ${
                          selectedPrediction === pred
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {predictionLabels[pred]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Bet Amount (ETH)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handlePlaceBet}
                  disabled={isPending || !address}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition"
                >
                  {isPending ? 'Placing Bet...' : !address ? 'Connect Wallet First' : `Bet ${betAmount} ETH`}
                </button>
              </div>
            </div>
          )}

          {pool.status === 2 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-2">Pool Resolved</h3>
              <p className="text-gray-300">
                Result: <span className="text-green-400 font-bold">{predictionLabels[pool.result]}</span>
              </p>
            </div>
          )}

          {myBetsForThisPool.length > 0 && (
            <div className="mt-6 bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">My Bets on This Pool</h3>
              <div className="space-y-2">
                {myBetsForThisPool.map((bet: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
                    <div>
                      <span className="text-white font-semibold">{predictionLabels[bet.prediction]}</span>
                      <span className="text-gray-400 text-sm ml-2">
                        {(Number(bet.amount) / 1e18).toFixed(4)} ETH
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      bet.claimed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {bet.claimed ? 'Claimed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
