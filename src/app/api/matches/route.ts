import { NextRequest, NextResponse } from 'next/server';
import { getAllMatches, getMatchByPoolId, saveMatch } from '@/lib/matchStorage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const poolId = searchParams.get('poolId');

    if (poolId) {
      const match = getMatchByPoolId(parseInt(poolId));
      if (!match) {
        return NextResponse.json({ error: 'Match not found' }, { status: 404 });
      }
      return NextResponse.json(match);
    }

    const matches = getAllMatches();
    return NextResponse.json(matches);
  } catch (error) {
    console.error('GET /api/matches error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必填字段
    if (!body.poolId || !body.matchTitle || !body.homeTeam || !body.awayTeam) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const matchInfo = {
      poolId: parseInt(body.poolId),
      matchTitle: body.matchTitle,
      league: body.league || '',
      homeTeam: body.homeTeam,
      awayTeam: body.awayTeam,
      description: body.description || '',
      logo: body.logo || '',
      createdAt: Date.now(),
      txHash: body.txHash || '',
    };

    saveMatch(matchInfo);
    
    return NextResponse.json({ success: true, match: matchInfo });
  } catch (error) {
    console.error('POST /api/matches error:', error);
    return NextResponse.json({ error: 'Failed to save match' }, { status: 500 });
  }
}
