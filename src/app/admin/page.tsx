'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/app';
import { BASE_PLAY_ABI } from '@/lib/abi/basePlay';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Admin() {
  const router = useRouter();
  const { address } = useAccount();
  
  // 表单字段
  const [matchTitle, setMatchTitle] = useState('');
  const [league, setLeague] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [description, setDescription] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: contractOwner } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: BASE_PLAY_ABI,
    functionName: 'owner',
    chainId: CONTRACT_CONFIG.chainId,
  });

  const { writeContract } = useWriteContract();

  const isAdmin = address?.toLowerCase() === contractOwner?.toLowerCase();

  // 验证表单
  const validateForm = (): string | null => {
    if (!matchTitle.trim()) return '请输入比赛标题';
    if (!homeTeam.trim()) return '请输入主队名称';
    if (!awayTeam.trim()) return '请输入客队名称';
    
    return null;
  };

  const handleCreatePool = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    // 验证表单
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const matchName = `${homeTeam} vs ${awayTeam}`;

      console.log('创建池子参数:', {
        matchName
      });

      // 调用合约 - 使用简化版 ABI（只传 matchName）
      writeContract({
        address: CONTRACT_CONFIG.address,
        abi: BASE_PLAY_ABI,
        functionName: 'createPool',
        args: [matchName],
      }, {
        onSuccess: async (hash) => {
          console.log('✅ 交易已发送:', hash);
          setSuccessMessage('交易已提交，等待确认...');
          
          // 等待交易确认并保存比赛信息
          setTimeout(async () => {
            try {
              // 保存比赛信息（使用时间戳作为临时 poolId，实际应该从事件获取）
              const response = await fetch('/api/matches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  poolId: Date.now(), // 临时使用时间戳
                  matchTitle,
                  league: league || '未分类',
                  homeTeam,
                  awayTeam,
                  description,
                  txHash: hash,
                })
              });

              if (response.ok) {
                const data = await response.json();
                setSuccessMessage(`池子创建成功！交易: ${hash.slice(0, 10)}...`);
                
                // 3秒后跳转到列表页
                setTimeout(() => {
                  router.push('/pools');
                  router.refresh();
                }, 3000);
              } else {
                setErrorMessage('池子创建成功，但比赛信息保存失败。请记录交易哈希: ' + hash);
                setIsSubmitting(false);
              }
            } catch (err) {
              console.error('保存比赛信息失败:', err);
              setErrorMessage('池子创建成功，但比赛信息保存失败。请手动保存交易哈希: ' + hash);
              setIsSubmitting(false);
            }
          }, 3000);
        },
        onError: (error: any) => {
          console.error('❌ 交易失败:', error);
          const reason = error.cause?.reason || error.shortMessage || error.message || '未知错误';
          setErrorMessage(`创建失败: ${reason}`);
          setIsSubmitting(false);
        }
      });
    } catch (error: any) {
      console.error('提交失败:', error);
      setErrorMessage(error.message || '提交失败');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition">
            ← BasePlay
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/pools" className="text-gray-300 hover:text-white transition">
              查看所有池子
            </Link>
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-extrabold text-white mb-2">⚙️ 管理后台</h1>
        <p className="text-gray-400 mb-8">创建新的预测池</p>

        {!address ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <p className="text-gray-400 text-lg mb-6">请先连接钱包</p>
            <ConnectButton />
          </div>
        ) : !isAdmin ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-12 text-center backdrop-blur-sm">
            <p className="text-red-400 text-lg">⚠️ 权限不足</p>
            <p className="text-gray-400 mt-2">只有合约管理员可以访问此页面</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 消息提示 */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 font-semibold">❌ {errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-400 font-semibold">✅ {successMessage}</p>
              </div>
            )}

            {/* 创建池子表单 */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">创建比赛池</h2>
              
              <div className="space-y-4">
                {/* 比赛标题 */}
                <div>
                  <label className="text-gray-300 font-semibold mb-2 block">
                    比赛标题 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={matchTitle}
                    onChange={(e) => setMatchTitle(e.target.value)}
                    placeholder="例如：英超第 15 轮"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* 联赛 */}
                <div>
                  <label className="text-gray-300 font-semibold mb-2 block">联赛</label>
                  <input
                    type="text"
                    value={league}
                    onChange={(e) => setLeague(e.target.value)}
                    placeholder="例如：英超"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* 主队 vs 客队 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-semibold mb-2 block">
                      主队 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={homeTeam}
                      onChange={(e) => setHomeTeam(e.target.value)}
                      placeholder="例如：曼联"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 font-semibold mb-2 block">
                      客队 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={awayTeam}
                      onChange={(e) => setAwayTeam(e.target.value)}
                      placeholder="例如：利物浦"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 描述 */}
                <div>
                  <label className="text-gray-300 font-semibold mb-2 block">描述（可选）</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="比赛描述..."
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* 提交按钮 */}
                <button
                  onClick={handleCreatePool}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition text-lg mt-6"
                >
                  {isSubmitting ? '⏳ 创建中...' : '🚀 创建池子'}
                </button>
              </div>
            </div>

            {/* 说明 */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <p className="text-yellow-400 font-semibold mb-2">📝 说明</p>
              <ul className="text-gray-300 text-sm space-y-2 list-disc list-inside">
                <li>创建池子需要支付 Gas 费用</li>
                <li>池子创建后会立即显示在列表中</li>
                <li>用户可以随时下注</li>
                <li>比赛结束后需要管理员手动结算</li>
                <li>比赛信息存储在本地 JSON 文件中</li>
                <li>当前合约版本：简化版（只需比赛名称）</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
