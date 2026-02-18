const LEADERBOARD_KEY = 'kids-game-leaderboard';
const MAX_ENTRIES_PER_GAME = 10;

export type GameType = 'bubble-pop' | 'fruit-shop';

export interface LeaderboardEntry {
  playerName: string;
  avatar: string;
  score: number;
  game: GameType;
  date: string;
}

export function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load leaderboard:', e);
  }

  return [];
}

function saveLeaderboard(entries: LeaderboardEntry[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save leaderboard:', e);
  }
}

export function addLeaderboardEntry(
  playerName: string,
  avatar: string,
  score: number,
  game: GameType
): boolean {
  if (score <= 0) return false;

  const entries = loadLeaderboard();

  const newEntry: LeaderboardEntry = {
    playerName,
    avatar,
    score,
    game,
    date: new Date().toISOString(),
  };

  entries.push(newEntry);

  const gameEntries = entries
    .filter((e) => e.game === game)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES_PER_GAME);

  const otherEntries = entries.filter((e) => e.game !== game);
  saveLeaderboard([...otherEntries, ...gameEntries]);

  return gameEntries.some(
    (e) => e.playerName === playerName && e.score === score && e.date === newEntry.date
  );
}

export function getLeaderboardForGame(game: GameType): LeaderboardEntry[] {
  return loadLeaderboard()
    .filter((e) => e.game === game)
    .sort((a, b) => b.score - a.score);
}

export function getTopScores(limit = 5): LeaderboardEntry[] {
  return loadLeaderboard()
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
