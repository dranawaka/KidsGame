import { NextRequest, NextResponse } from 'next/server';
import { getDb, isMongoConfigured } from '@/lib/mongodb';

const MAX_ENTRIES_PER_GAME = 10;

export async function GET(request: NextRequest) {
  const game = request.nextUrl.searchParams.get('game');

  if (!isMongoConfigured()) {
    return NextResponse.json([]);
  }

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

    if (!isMongoConfigured()) {
      console.warn(
        '[Leaderboard] MONGODB_URI is not set. Add it to .env.local to persist leaderboard to the database.'
      );
      return NextResponse.json({
        success: true,
        madeBoard: false,
        persisted: false,
      });
    }

    const db = await getDb();
    const collection = db.collection('leaderboard');

    const existing = await collection.findOne({ playerName, game });

    if (existing) {
      // Replace only if new score is higher
      if (score > existing.score) {
        const result = await collection.updateOne(
          { playerName, game },
          {
            $set: {
              avatar,
              score,
              date: new Date().toISOString(),
            },
          }
        );
        if (!result.acknowledged) {
          console.error('[Leaderboard] updateOne was not acknowledged by MongoDB');
        }
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
      const result = await collection.insertOne(entry);
      if (!result.acknowledged) {
        console.error('[Leaderboard] insertOne was not acknowledged by MongoDB');
      }
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

    return NextResponse.json({
      success: true,
      madeBoard,
      persisted: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Leaderboard] Failed to add entry:', message, error);
    return NextResponse.json(
      { error: 'Internal server error', persisted: false },
      { status: 500 }
    );
  }
}
