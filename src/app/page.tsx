'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract } from 'wagmi';
import { APP_CONFIG, CONTRACT_CONFIG } from '@/config/app';
import { BASE_PLAY_ABI } from '@/lib/abi/basePlay';
import Link from 'next/link';

export default function Home() {
  const { data: pools } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: BASE_PLAY_ABI,
    functionName: 'getAllPools',
    chainId: CONTRACT_CONFIG.chainId,
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{APP_CONFIG.name}</h1>
            <p className="text-sm text-gray-400">{APP_CONFIG.tagline}</p>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
          Predict. Win. Dominate.
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {APP_CONFIG.description}
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/pools" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition"
          >
            View Pools
          </Link>
          <Link 
            href="/my-bets" 
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold text-white transition"
          >
            My Bets
          </Link>
        </div>
      </section>

      {/* Pools List */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold text-white mb-6">Active Prediction Pools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools && pools.length > 0 ? (
            pools.map((pool: any, index: number) => (
              <PoolCard key={index} pool={pool} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No active pools yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          title="🎯 Fair Odds"
          description="Parimutuel system - winners split the pool proportionally"
        />
        <FeatureCard 
          title="🔗 On-Chain"
          description="All predictions verified on Base blockchain"
        />
        <FeatureCard 
          title="🏆 Leaderboard"
          description="Track top predictors and claim your bragging rights"
        />
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>Built on Base • {APP_CONFIG.builderCode}</p>
          <div className="mt-4 flex gap-4 justify-center">
            <Link href="/leaderboard" className="hover:text-white transition">Leaderboard</Link>
            <Link href="/admin" className="hover:text-white transition">Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function PoolCard({ pool }: { pool: any }) {
  const totalEth = Number(pool.totalPool) / 1e18;
  const statusLabels = ['Open', 'Locked', 'Resolved'];
  
  return (
    <Link href={`/pools/${pool.poolId}`}>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition cursor-pointer backdrop-blur-sm">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-xl font-bold text-white">{pool.matchName}</h4>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            pool.status === 0 ? 'bg-green-500/20 text-green-400' :
            pool.status === 1 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-blue-500/20 text-blue-400'
          }`}>
            {statusLabels[pool.status] || 'Unknown'}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Pool</span>
            <span className="text-white font-semibold">{totalEth.toFixed(4)} ETH</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs mt-4">
            <div className="bg-green-500/10 rounded p-2 text-center">
              <div className="text-gray-400">Home</div>
              <div className="text-green-400 font-bold">{(Number(pool.homeAmount) / 1e18).toFixed(2)}</div>
            </div>
            <div className="bg-gray-500/10 rounded p-2 text-center">
              <div className="text-gray-400">Draw</div>
              <div className="text-gray-300 font-bold">{(Number(pool.drawAmount) / 1e18).toFixed(2)}</div>
            </div>
            <div className="bg-red-500/10 rounded p-2 text-center">
              <div className="text-gray-400">Away</div>
              <div className="text-red-400 font-bold">{(Number(pool.awayAmount) / 1e18).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center backdrop-blur-sm">
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
