export type GameType = 'bubble-pop' | 'fruit-shop';

export interface LeaderboardEntry {
  playerName: string;
  avatar: string;
  score: number;
  game: GameType;
  date: string;
}

/**
 * Fire-and-forget: posts a new score to the leaderboard API.
 * Called from Zustand stores — intentionally does not block game flow.
 */
export function addLeaderboardEntry(
  playerName: string,
  avatar: string,
  score: number,
  game: GameType
): void {
  if (score <= 0) return;

  fetch('/api/leaderboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName, avatar, score, game }),
  }).catch((err) => console.error('Failed to post leaderboard entry:', err));
}

/**
 * Fetches leaderboard entries for a specific game from the API.
 */
export async function fetchLeaderboardForGame(
  game: GameType
): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`/api/leaderboard?game=${game}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
    return [];
  }
}
