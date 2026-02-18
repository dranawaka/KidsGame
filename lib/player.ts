const PLAYER_KEY = 'kids-game-player';

export interface Player {
  name: string;
  avatar: string;
}

const AVATARS = ['🦁', '🐯', '🐻', '🐼', '🐨', '🦊', '🐸', '🐵', '🦄', '🐲', '🐙', '🦋'];

export function getRandomAvatar(): string {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

export function getAvatars(): string[] {
  return AVATARS;
}

export function loadPlayer(): Player | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(PLAYER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load player:', e);
  }

  return null;
}

export function savePlayer(player: Player): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
  } catch (e) {
    console.error('Failed to save player:', e);
  }
}

export function clearPlayer(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(PLAYER_KEY);
  } catch (e) {
    console.error('Failed to clear player:', e);
  }
}
