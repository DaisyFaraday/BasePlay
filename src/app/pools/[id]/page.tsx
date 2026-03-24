'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/app';
import { BASE_PLAY_ABI } from '@/lib/abi/basePlay';
import { parseEther } from 'viem';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { MatchInfo } from '@/types/match';

export default function PoolDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const poolId = BigInt(id);
  const { address } = useAccount();
  const [betAmount, setBetAmount] = useState('0.01');
  const [selectedPrediction, setSelectedPrediction] = useState<number>(0);
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);

  const { data: pool, refetch } = useReadContract({
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

  // 获取比赛信息
  useEffect(() => {
    fetch(`/api/matches?poolId=${id}`)
      .then(res => res.json())
      .then(data => setMatchInfo(data))
      .catch(err => console.error('Failed to load match info:', err));
  }, [id]);

  const handlePlaceBet = () => {
    if (!address) {
      alert('请先连接钱包');
      return;
    }
    writeContract({
      address: CONTRACT_CONFIG.address,
      abi: BASE_PLAY_ABI,
      functionName: 'placeBet',
      args: [poolId, selectedPrediction],
      value: parseEther(betAmount),
    }, {
      onSuccess: () => {
        alert('下注成功！');
        refetch();
      },
      onError: (error: any) => {
        alert('下注失败: ' + (error.shortMessage || error.message));
      }
    });
  };

  if (!pool) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </main>
    );
  }

  const poolData = pool as any;
  const totalEth = Number(poolData.totalPool || 0) / 1e18;
  const homeAmount = Number(poolData.homeAmount || 0) / 1e18;
  const drawAmount = Number(poolData.drawAmount || 0) / 1e18;
  const awayAmount = Number(poolData.awayAmount || 0) / 1e18;

  const now = Math.floor(Date.now() / 1000);
  const startTime = Number(poolData.startTime || 0);
  const endTime = Number(poolData.endTime || 0);
  const status = Number(poolData.status || 0);

  // 确定状态
  let statusLabel = '';
  let statusColor = '';
  let canBet = false;
  
  if (now < startTime) {
    statusLabel = '未开始';
    statusColor = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    canBet = false;
  } else if (now >= startTime && now < endTime && status === 0) {
    statusLabel = '可下注';
    statusColor = 'bg-green-500/20 text-green-400 border-green-500/30';
    canBet = true;
  } else if (now >= endTime && status < 2) {
    statusLabel = '已封盘';
    statusColor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    canBet = false;
  } else if (status === 2) {
    statusLabel = '已结算';
    statusColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    canBet = false;
  }

  const displayTitle = matchInfo 
    ? `${matchInfo.homeTeam} vs ${matchInfo.awayTeam}`
    : `Pool #${id}`;

  const predictions = [
    { id: 0, label: matchInfo?.homeTeam || '主队胜', amount: homeAmount, color: 'green' },
    { id: 1, label: '平局', amount: drawAmount, color: 'gray' },
    { id: 2, label: matchInfo?.awayTeam || '客队胜', amount: awayAmount, color: 'red' },
  ];

  // 用户在此池的投注
  const myBetsInPool = (userBets as any[])?.filter((bet: any) => Number(bet.poolId) === Number(id)) || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/pools" className="text-white hover:text-blue-400 transition font-semibold">
            ← 返回列表
          </Link>
          <ConnectButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pool Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
              {matchInfo?.league && (
                <div className="text-sm text-gray-400 mb-2">{matchInfo.league}</div>
              )}
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-white">{displayTitle}</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>

              {matchInfo?.matchTitle && (
                <p className="text-gray-300 mb-4">{matchInfo.matchTitle}</p>
              )}

              {matchInfo?.description && (
                <p className="text-gray-400 text-sm mb-4">{matchInfo.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">开始时间:</span>
                  <p className="text-white font-semibold">{new Date(startTime * 1000).toLocaleString('zh-CN')}</p>
                </div>
                <div>
                  <span className="text-gray-400">结束时间:</span>
                  <p className="text-white font-semibold">{new Date(endTime * 1000).toLocaleString('zh-CN')}</p>
                </div>
              </div>
            </div>

            {/* Prize Pool */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-8 text-center backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-2">总奖池</h2>
              <p className="text-5xl font-extrabold text-white mb-2">{totalEth.toFixed(4)} <span className="text-2xl text-blue-400">ETH</span></p>
              <p className="text-gray-400 text-sm">赢家将按比例分配奖池</p>
            </div>

            {/* Predictions */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">投注分布</h2>
              <div className="space-y-4">
                {predictions.map((pred) => {
                  const percentage = totalEth > 0 ? (pred.amount / totalEth * 100).toFixed(1) : '0.0';
                  const colorClasses = {
                    green: 'bg-green-500/20 border-green-500/50 text-green-400',
                    gray: 'bg-gray-500/20 border-gray-500/50 text-gray-300',
                    red: 'bg-red-500/20 border-red-500/50 text-red-400',
                  }[pred.color];

                  return (
                    <div key={pred.id} className={`border-2 rounded-xl p-4 ${colorClasses}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">{pred.label}</span>
                        <span className="font-bold text-2xl">{pred.amount.toFixed(3)} ETH</span>
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${pred.color === 'green' ? 'bg-green-500' : pred.color === 'red' ? 'bg-red-500' : 'bg-gray-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm mt-1 text-right">{percentage}%</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* My Bets */}
            {myBetsInPool.length > 0 && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-4">我的投注</h2>
                <div className="space-y-3">
                  {myBetsInPool.map((bet: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-black/30 rounded-lg p-4">
                      <span className="text-gray-300">{predictions[bet.prediction]?.label}</span>
                      <span className="text-white font-bold">{(Number(bet.amount) / 1e18).toFixed(4)} ETH</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Bet Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">下注</h2>

              {!canBet ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">
                    {now < startTime ? '比赛尚未开始' : '投注已关闭'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {now < startTime 
                      ? `将于 ${new Date(startTime * 1000).toLocaleString('zh-CN')} 开始`
                      : '等待结算'}
                  </p>
                </div>
              ) : !address ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">请先连接钱包</p>
                  <ConnectButton />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Prediction Selection */}
                  <div>
                    <label className="text-gray-300 font-semibold mb-3 block">选择预测</label>
                    <div className="space-y-2">
                      {predictions.map((pred) => (
                        <button
                          key={pred.id}
                          onClick={() => setSelectedPrediction(pred.id)}
                          className={`w-full p-4 rounded-lg border-2 font-semibold transition ${
                            selectedPrediction === pred.id
                              ? pred.color === 'green' ? 'bg-green-500/30 border-green-500 text-green-300' :
                                pred.color === 'red' ? 'bg-red-500/30 border-red-500 text-red-300' :
                                'bg-gray-500/30 border-gray-500 text-gray-300'
                              : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          {pred.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="text-gray-300 font-semibold mb-3 block">投注金额 (ETH)</label>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      min="0.001"
                      step="0.001"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-2 mt-2">
                      {['0.01', '0.05', '0.1', '0.5'].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setBetAmount(amount)}
                          className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition"
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Place Bet Button */}
                  <button
                    onClick={handlePlaceBet}
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition text-lg"
                  >
                    {isPending ? '⏳ 处理中...' : '🚀 确认下注'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    下注后无法撤回，请谨慎操作
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
