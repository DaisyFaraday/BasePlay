'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Leaderboard() {
  // Mock data - in production, fetch from subgraph or backend
  const topPredictors = [
    { rank: 1, address: '0x1234...5678', wins: 12, totalEarned: 2.45 },
    { rank: 2, address: '0xabcd...efgh', wins: 10, totalEarned: 1.89 },
    { rank: 3, address: '0x9876...4321', wins: 8, totalEarned: 1.23 },
  ];

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
        <h1 className="text-4xl font-extrabold text-white mb-4">🏆 Leaderboard</h1>
        <p className="text-gray-400 mb-8">Top predictors on BasePlay</p>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
          <table className="w-full">
            <thead className="bg-black/50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Rank</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Address</th>
                <th className="px-6 py-4 text-right text-gray-400 font-semibold">Wins</th>
                <th className="px-6 py-4 text-right text-gray-400 font-semibold">Total Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {topPredictors.map((user) => (
                <tr key={user.rank} className="hover:bg-gray-700/30 transition">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      user.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      user.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                      user.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {user.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-mono">{user.address}</td>
                  <td className="px-6 py-4 text-right text-white font-semibold">{user.wins}</td>
                  <td className="px-6 py-4 text-right text-green-400 font-bold">{user.totalEarned} ETH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
          <p className="text-gray-300">
            💡 Leaderboard updates every 24 hours. Keep predicting to climb the ranks!
          </p>
        </div>
      </div>
    </main>
  );
}
