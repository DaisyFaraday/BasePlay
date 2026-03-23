'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/app';
import { BASE_PLAY_ABI } from '@/lib/abi/basePlay';
import Link from 'next/link';
import { useState } from 'react';

export default function MyBets() {
  const { address } = useAccount();
  const [claimingPool, setClaimingPool] = useState<bigint | null>(null);

  const { data: userBets, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: BASE_PLAY_ABI,
    functionName: 'getUserBets',
    args: [address as `0x${string}`],
    chainId: CONTRACT_CONFIG.chainId,
    query: { enabled: !!address },
  });

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setClaimingPool(null);
        refetch();
      },
    },
  });

  const handleClaim = (poolId: bigint) => {
    setClaimingPool(poolId);
    writeContract({
      address: CONTRACT_CONFIG.address,
      abi: BASE_PLAY_ABI,
      functionName: 'claimReward',
      args: [poolId],
    });
  };

  const predictionLabels = ['Home Win', 'Draw', 'Away Win'];

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
        <h1 className="text-4xl font-extrabold text-white mb-8">My Bets</h1>

        {!address ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <p className="text-gray-400 text-lg mb-6">Connect your wallet to view your bets</p>
            <ConnectButton />
          </div>
        ) : !userBets || userBets.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <p className="text-gray-400 text-lg">No bets yet. Time to make your first prediction!</p>
            <Link href="/" className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition">
              View Pools
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userBets.map((bet: any, idx: number) => (
              <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link 
                      href={`/pools/${bet.poolId}`}
                      className="text-xl font-bold text-white hover:text-blue-400 transition"
                    >
                      Pool #{bet.poolId.toString()}
                    </Link>
                    <p className="text-gray-400 mt-1">
                      Prediction: <span className="text-blue-400 font-semibold">{predictionLabels[bet.prediction]}</span>
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    bet.claimed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {bet.claimed ? 'Claimed' : 'Active'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">Bet Amount</div>
                    <div className="text-white text-2xl font-bold">{(Number(bet.amount) / 1e18).toFixed(4)} ETH</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-1">Status</div>
                    <div className="text-white text-xl font-semibold">
                      {bet.claimed ? '✓ Claimed' : 'Pending'}
                    </div>
                  </div>
                </div>

                {!bet.claimed && (
                  <button
                    onClick={() => handleClaim(bet.poolId)}
                    disabled={isPending && claimingPool === bet.poolId}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition"
                  >
                    {isPending && claimingPool === bet.poolId ? 'Claiming...' : 'Claim Reward'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
