'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract } from 'wagmi';
import { APP_CONFIG, CONTRACT_CONFIG } from '@/config/app';
import { BASE_PLAY_ABI } from '@/lib/abi/basePlay';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MatchInfo } from '@/types/match';

export default function Home() {
  const [matchesData, setMatchesData] = useState<MatchInfo[]>([]);

  const { data: contractPools, isLoading } = useReadContract({
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

  const pools = (contractPools as any[]) || [];
  
  // 合并链上数据和比赛信息
  const poolsWithMatch = pools.map((pool: any) => {
    const matchInfo = matchesData.find(m => m.poolId === Number(pool.poolId));
    return { ...pool, matchInfo };
  });

  // 只显示前6个池子
  const displayPools = poolsWithMatch.slice(0, 6);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="cursor-pointer">
              <h1 className="text-2xl font-bold text-white hover:text-blue-400 transition">{APP_CONFIG.name}</h1>
              <p className="text-sm text-gray-400">{APP_CONFIG.tagline}</p>
            </div>
          </Link>
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
        <div className="flex gap-4 justify-center flex-wrap">
          <Link 
            href="/pools" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition shadow-lg hover:shadow-blue-500/50"
          >
            🏊 查看所有池子
          </Link>
          <Link 
            href="/my-bets" 
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold text-white transition"
          >
            📊 我的投注
          </Link>
          <Link 
            href="/admin" 
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition"
          >
            ⚙️ 管理后台
          </Link>
        </div>
      </section>

      {/* Pools List */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold text-white">热门预测池</h3>
          {displayPools.length > 0 && (
            <Link 
              href="/pools" 
              className="text-blue-400 hover:text-blue-300 transition font-semibold"
            >
              查看全部 →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400 text-lg">加载中...</p>
            </div>
          ) : displayPools.length > 0 ? (
            displayPools.map((pool: any) => (
              <PoolCard key={pool.poolId} pool={pool} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🎱</div>
              <p className="text-gray-400 text-lg mb-4">暂无池子，创建第一个吧！</p>
              <Link 
                href="/admin"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition"
              >
                创建池子
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/about/fair-odds">
          <FeatureCard 
            title="🎯 公平赔率"
            description="Parimutuel 系统 - 赢家按比例分配奖池"
            clickable
          />
        </Link>
        <Link href="/about/on-chain">
          <FeatureCard 
            title="🔗 链上验证"
            description="所有预测在 Base 区块链上验证"
            clickable
          />
        </Link>
        <Link href="/leaderboard">
          <FeatureCard 
            title="🏆 排行榜"
            description="追踪顶级预测者并获得荣誉"
            clickable
          />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>Built on Base • {APP_CONFIG.builderCode}</p>
          <div className="mt-4 flex gap-4 justify-center">
            <Link href="/leaderboard" className="hover:text-white transition">排行榜</Link>
            <Link href="/admin" className="hover:text-white transition">管理</Link>
            <Link href="/pools" className="hover:text-white transition">所有池子</Link>
          </div>
        </div>
      </footer>
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
  }

  const matchInfo = pool.matchInfo;
  const displayTitle = matchInfo 
    ? `${matchInfo.homeTeam} vs ${matchInfo.awayTeam}`
    : `Pool #${pool.poolId}`;
  const league = matchInfo?.league || '';
  
  return (
    <Link href={`/pools/${pool.poolId}`}>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition cursor-pointer backdrop-blur-sm">
        <div className="mb-4">
          {league && (
            <div className="text-xs text-gray-500 mb-2">{league}</div>
          )}
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-xl font-bold text-white flex-1">{displayTitle}</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ml-2 ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {new Date(startTime * 1000).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">总奖池</span>
            <span className="text-white font-semibold">{totalEth.toFixed(4)} ETH</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs mt-4">
            <div className="bg-green-500/10 rounded p-2 text-center">
              <div className="text-gray-400">主胜</div>
              <div className="text-green-400 font-bold">{(Number(pool.homeAmount || 0) / 1e18).toFixed(2)}</div>
            </div>
            <div className="bg-gray-500/10 rounded p-2 text-center">
              <div className="text-gray-400">平局</div>
              <div className="text-gray-300 font-bold">{(Number(pool.drawAmount || 0) / 1e18).toFixed(2)}</div>
            </div>
            <div className="bg-red-500/10 rounded p-2 text-center">
              <div className="text-gray-400">客胜</div>
              <div className="text-red-400 font-bold">{(Number(pool.awayAmount || 0) / 1e18).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ title, description, clickable }: { title: string; description: string; clickable?: boolean }) {
  return (
    <div className={`bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center backdrop-blur-sm transition ${
      clickable ? 'hover:border-blue-500 hover:bg-gray-800/50 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20' : ''
    }`}>
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-gray-400">{description}</p>
      {clickable && (
        <div className="mt-4 text-blue-400 text-sm font-semibold">
          了解更多 →
        </div>
      )}
    </div>
  );
}
