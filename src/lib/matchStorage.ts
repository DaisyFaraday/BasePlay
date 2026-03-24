import fs from 'fs';
import path from 'path';
import { MatchInfo } from '@/types/match';

const DATA_FILE = path.join(process.cwd(), 'data', 'matches.json');

// 确保数据目录和文件存在
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export function getAllMatches(): MatchInfo[] {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading matches:', error);
    return [];
  }
}

export function getMatchByPoolId(poolId: number): MatchInfo | null {
  const matches = getAllMatches();
  return matches.find(m => m.poolId === poolId) || null;
}

export function saveMatch(matchInfo: MatchInfo): void {
  try {
    ensureDataFile();
    const matches = getAllMatches();
    
    // 如果已存在相同 poolId，更新；否则添加
    const index = matches.findIndex(m => m.poolId === matchInfo.poolId);
    if (index >= 0) {
      matches[index] = matchInfo;
    } else {
      matches.push(matchInfo);
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(matches, null, 2));
  } catch (error) {
    console.error('Error saving match:', error);
    throw new Error('Failed to save match info');
  }
}

export function deleteMatch(poolId: number): void {
  try {
    ensureDataFile();
    const matches = getAllMatches();
    const filtered = matches.filter(m => m.poolId !== poolId);
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  } catch (error) {
    console.error('Error deleting match:', error);
    throw new Error('Failed to delete match info');
  }
}
