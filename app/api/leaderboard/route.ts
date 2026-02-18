import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const MAX_ENTRIES_PER_GAME = 10;

export async function GET(request: NextRequest) {
  const game = request.nextUrl.searchParams.get('game');

  try {
    const db = await getDb();
    const collection = db.collection('leaderboard');

    const filter = game ? { game } : {};
    const entries = await collection
      .find(filter)
      .sort({ score: -1 })
      .limit(MAX_ENTRIES_PER_GAME)
      .toArray();

    const cleaned = entries.map(({ _id, ...rest }) => rest);
    return NextResponse.json(cleaned);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerName, avatar, score, game } = body;

    if (!playerName || !avatar || typeof score !== 'number' || !game) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (score <= 0) {
      return NextResponse.json({ error: 'Score must be positive' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('leaderboard');

    const existing = await collection.findOne({ playerName, game });

    if (existing) {
      // Replace only if new score is higher
      if (score > existing.score) {
        await collection.updateOne(
          { playerName, game },
          {
            $set: {
              avatar,
              score,
              date: new Date().toISOString(),
            },
          }
        );
      }
      // If new score is lower or equal, keep existing entry
    } else {
      const entry = {
        playerName,
        avatar,
        score,
        game,
        date: new Date().toISOString(),
      };
      await collection.insertOne(entry);
    }

    // Keep only the top entries per game — remove lowest scores beyond the limit
    const allForGame = await collection
      .find({ game })
      .sort({ score: -1 })
      .toArray();

    if (allForGame.length > MAX_ENTRIES_PER_GAME) {
      const toRemove = allForGame.slice(MAX_ENTRIES_PER_GAME);
      const idsToRemove = toRemove.map((e) => e._id);
      await collection.deleteMany({ _id: { $in: idsToRemove } });
    }

    const madeBoard = allForGame
      .slice(0, MAX_ENTRIES_PER_GAME)
      .some((e) => e.playerName === playerName);

    return NextResponse.json({ success: true, madeBoard });
  } catch (error) {
    console.error('Failed to add leaderboard entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
