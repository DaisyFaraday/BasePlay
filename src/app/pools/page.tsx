'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/app';
import { BASE_PLAY_ABI } from '@/lib/abi/basePlay';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MatchInfo } from '@/types/match';

export default function PoolsPage() {
  const [matchesData, setMatchesData] = useState<MatchInfo[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'open' | 'closed' | 'resolved'>('all');

  const { data: contractPools, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: BASE_PLAY_ABI,
    functionName: 'getAllPools',
    chainId: CONTRACT_CONFIG.chainId,
  });

  // 获取比赛信息
  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => setMatchesData(data))
      .catch(err => console.error('Failed to load matches:', err));
  }, []);

  // 定期刷新
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000); // 每10秒刷新一次
    return () => clearInterval(interval);
  }, [refetch]);

  const pools = (contractPools as any[]) || [];
  
  // 合并链上数据和比赛信息
  const poolsWithMatch = pools.map((pool: any) => {
    const matchInfo = matchesData.find(m => m.poolId === Number(pool.poolId));
    return { ...pool, matchInfo };
  });

  // 过滤池子
  const filteredPools = poolsWithMatch.filter((pool: any) => {
    const now = Math.floor(Date.now() / 1000);
    const startTime = Number(pool.startTime || 0);
    const endTime = Number(pool.endTime || 0);
    const status = Number(pool.status || 0);

    switch (filter) {
      case 'upcoming':
        return now < startTime; // 未开始
      case 'open':
        return now >= startTime && now < endTime && status === 0; // 可下注
      case 'closed':
        return now >= endTime && status < 2; // 已封盘
      case 'resolved':
        return status === 2; // 已结算
      default:
        return true; // 全部
    }
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-white hover:text-blue-400 transition cursor-pointer">
              BasePlay
            </h1>
          </Link>
          <ConnectButton />
        </div>
      </header>

      {/* Page Title */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-white mb-2">所有预测池</h2>
        <p className="text-gray-400">选择比赛进行预测</p>
      </section>

      {/* Filter Tabs */}
      <section className="container mx-auto px-4 pb-6">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: '全部', count: poolsWithMatch.length },
            { key: 'upcoming', label: '未开始', count: poolsWithMatch.filter((p: any) => Math.floor(Date.now() / 1000) < Number(p.startTime || 0)).length },
            { key: 'open', label: '可下注', count: poolsWithMatch.filter((p: any) => {
              const now = Math.floor(Date.now() / 1000);
              return now >= Number(p.startTime || 0) && now < Number(p.endTime || 0) && Number(p.status || 0) === 0;
            }).length },
            { key: 'closed', label: '已封盘', count: poolsWithMatch.filter((p: any) => Math.floor(Date.now() / 1000) >= Number(p.endTime || 0) && Number(p.status || 0) < 2).length },
            { key: 'resolved', label: '已结算', count: poolsWithMatch.filter((p: any) => Number(p.status || 0) === 2).length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </section>

      {/* Pools Grid */}
      <section className="container mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">加载中...</p>
          </div>
        ) : filteredPools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPools.map((pool: any) => (
              <PoolCard key={pool.poolId} pool={pool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-400 text-lg mb-4">
              {filter === 'all' ? '暂无池子' : '此类别暂无池子'}
            </p>
            <Link
              href="/admin"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition"
            >
              创建第一个池子
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

function PoolCard({ pool }: { pool: any }) {
  const totalEth = Number(pool.totalPool || 0) / 1e18;
  const now = Math.floor(Date.now() / 1000);
  const startTime = Number(pool.startTime || 0);
  const endTime = Number(pool.endTime || 0);
  const status = Number(pool.status || 0);
  
  // 确定状态
  let statusLabel = '';
  let statusColor = '';
  
  if (now < startTime) {
    statusLabel = '未开始';
    statusColor = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  } else if (now >= startTime && now < endTime && status === 0) {
    statusLabel = '可下注';
    statusColor = 'bg-green-500/20 text-green-400 border-green-500/30';
  } else if (now >= endTime && status < 2) {
    statusLabel = '已封盘';
    statusColor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  } else if (status === 2) {
    statusLabel = '已结算';
    statusColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  } else {
    statusLabel = '未知';
    statusColor = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }

  const matchInfo = pool.matchInfo;
  const displayTitle = matchInfo 
    ? `${matchInfo.homeTeam} vs ${matchInfo.awayTeam}`
    : `Pool #${pool.poolId}`;
  const league = matchInfo?.league || '';
  
  return (
    <Link href={`/pools/${pool.poolId}`}>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer backdrop-blur-sm group">
        {/* Header */}
        <div className="mb-4">
          {league && (
            <div className="text-xs text-gray-500 mb-2">{league}</div>
          )}
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition flex-1">
              {displayTitle}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ml-2 ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Time Info */}
        <div className="text-xs text-gray-400 mb-4 space-y-1">
          <div>开始: {new Date(startTime * 1000).toLocaleString('zh-CN')}</div>
          <div>结束: {new Date(endTime * 1000).toLocaleString('zh-CN')}</div>
        </div>

        {/* Prize Pool */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">总奖池</div>
            <div className="text-3xl font-bold text-white">
              {totalEth.toFixed(4)} <span className="text-lg text-blue-400">ETH</span>
            </div>
          </div>
        </div>

        {/* Bet Distribution */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">主胜</div>
            <div className="text-green-400 font-bold">{(Number(pool.homeAmount || 0) / 1e18).toFixed(2)}</div>
            <div className="text-xs text-gray-500">ETH</div>
          </div>
          <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">平局</div>
            <div className="text-gray-300 font-bold">{(Number(pool.drawAmount || 0) / 1e18).toFixed(2)}</div>
            <div className="text-xs text-gray-500">ETH</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">客胜</div>
            <div className="text-red-400 font-bold">{(Number(pool.awayAmount || 0) / 1e18).toFixed(2)}</div>
            <div className="text-xs text-gray-500">ETH</div>
          </div>
        </div>

        {/* Enter Button */}
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition group-hover:shadow-lg group-hover:shadow-blue-500/50">
          查看详情 →
        </button>
      </div>
    </Link>
  );
}
