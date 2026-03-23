'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/app';
import { BASE_PLAY_ABI } from '@/lib/abi/basePlay';
import Link from 'next/link';
import { useState } from 'react';

export default function Admin() {
  const { address } = useAccount();
  const [matchName, setMatchName] = useState('');
  const [resolvePoolId, setResolvePoolId] = useState('');
  const [resolveResult, setResolveResult] = useState<number>(0);

  const { data: contractOwner } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: BASE_PLAY_ABI,
    functionName: 'owner',
    chainId: CONTRACT_CONFIG.chainId,
  });

  const { writeContract: createPool, isPending: isCreating } = useWriteContract();
  const { writeContract: resolvePool, isPending: isResolving } = useWriteContract();

  const isAdmin = address?.toLowerCase() === contractOwner?.toLowerCase() || 
                  address?.toLowerCase() === CONTRACT_CONFIG.adminWallet.toLowerCase();

  const handleCreatePool = () => {
    if (!matchName.trim()) {
      alert('Please enter a match name');
      return;
    }
    createPool({
      address: CONTRACT_CONFIG.address,
      abi: BASE_PLAY_ABI,
      functionName: 'createPool',
      args: [matchName],
    });
    setMatchName('');
  };

  const handleResolvePool = () => {
    if (!resolvePoolId) {
      alert('Please enter a pool ID');
      return;
    }
    resolvePool({
      address: CONTRACT_CONFIG.address,
      abi: BASE_PLAY_ABI,
      functionName: 'resolvePool',
      args: [BigInt(resolvePoolId), resolveResult],
    });
    setResolvePoolId('');
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
        <h1 className="text-4xl font-extrabold text-white mb-8">⚙️ Admin Panel</h1>

        {!address ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <p className="text-gray-400 text-lg mb-6">Connect your wallet to access admin panel</p>
            <ConnectButton />
          </div>
        ) : !isAdmin ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-12 text-center backdrop-blur-sm">
            <p className="text-red-400 text-lg">⚠️ Access Denied</p>
            <p className="text-gray-400 mt-2">Only contract admin can access this page</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Create Pool */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Create New Pool</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Match Name</label>
                  <input
                    type="text"
                    value={matchName}
                    onChange={(e) => setMatchName(e.target.value)}
                    placeholder="e.g., Manchester United vs Liverpool"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleCreatePool}
                  disabled={isCreating || !matchName.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  {isCreating ? 'Creating Pool...' : 'Create Pool'}
                </button>
              </div>
            </div>

            {/* Resolve Pool */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Resolve Pool</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Pool ID</label>
                  <input
                    type="number"
                    value={resolvePoolId}
                    onChange={(e) => setResolvePoolId(e.target.value)}
                    placeholder="Enter pool ID"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Match Result</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((result) => (
                      <button
                        key={result}
                        onClick={() => setResolveResult(result)}
                        className={`py-3 px-4 rounded-lg font-semibold transition ${
                          resolveResult === result
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {predictionLabels[result]}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleResolvePool}
                  disabled={isResolving || !resolvePoolId}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  {isResolving ? 'Resolving...' : 'Resolve Pool'}
                </button>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <p className="text-yellow-400 font-semibold mb-2">⚠️ Admin Responsibilities</p>
              <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                <li>Create pools for upcoming matches</li>
                <li>Resolve pools accurately after match ends</li>
                <li>Ensure fairness and transparency</li>
                <li>Monitor contract activity</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
