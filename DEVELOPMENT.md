# Bubble Pop Math - Development Guide

## Project Overview

Bubble Pop Math is a kid-friendly web game built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and Zustand. This guide explains the project structure, key features, and how to extend it.

---

## Architecture

### Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Zustand**: Lightweight state management
- **Web Audio API**: Sound effects
- **Web Speech API**: Voice prompts (optional)

### Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main menu and game orchestration
│   └── globals.css         # Global styles and animations
├── components/
│   ├── Bubble.tsx          # Individual bubble component
│   ├── GameScreen.tsx      # Main gameplay screen
│   ├── Settings.tsx        # Settings modal
│   └── GameOver.tsx        # End game screen with stats
├── lib/
│   ├── game-logic.ts       # Question generation & difficulty
│   ├── audio.ts            # Sound effects manager
│   ├── storage.ts          # localStorage persistence
│   └── accessibility.ts    # A11y utilities
├── store/
│   └── game-store.ts       # Zustand global state
├── types/
│   └── game.ts             # TypeScript interfaces & constants
└── public/                 # Static assets (can add custom sounds/images)
```

---

## Core Features

### 1. Question Generation (`lib/game-logic.ts`)

The game generates math questions based on:
- **Operation type**: +, -, ×, ÷
- **Difficulty range**: Controlled by level (1-10)
- **Smart distractors**: Wrong answers are plausible (near misses, common mistakes)

Key functions:
- `generateQuestion()`: Creates a question for a specific operation
- `generateBubbles()`: Creates answer choices with one correct answer
- `generateQuestionForLevel()`: Main entry point for new questions

### 2. Adaptive Difficulty

The game tracks the last 10 answers:
- **Accuracy > 85%**: Level increases by 1 (max 10)
- **Accuracy < 55%**: Level decreases by 1 (min 1)

Implementation in `game-logic.ts`:
```typescript
export function adjustLevel(currentLevel: number, accuracyWindow: boolean[]): number
```

### 3. State Management (`store/game-store.ts`)

Zustand store manages:
- Game state (score, streak, hearts, level)
- Settings (mode, sound, voice, motion)
- Player stats (best score, games played, accuracy)

Key actions:
- `startGame()`: Initializes new game session
- `answerQuestion()`: Handles bubble clicks
- `nextQuestion()`: Generates next question
- `updateSettings()`: Saves settings to localStorage

### 4. Audio System (`lib/audio.ts`)

Web Audio API for sound effects:
- `playCorrect()`: Ascending pleasant tone
- `playIncorrect()`: Gentle descending tone
- `playPop()`: Bubble pop effect
- `playCelebration()`: Level up fanfare
- `speak()`: Web Speech API for voice prompts

### 5. Accessibility Features

#### Keyboard Navigation
- Number keys (1-9) select bubbles
- Tab navigation supported
- Enter/Space to activate buttons
- Escape to close modals (can be added)

#### Screen Reader Support
- ARIA labels on all interactive elements
- Live regions for announcements
- Semantic HTML structure

#### Motion & Visual
- `reduceMotion` setting
- High contrast support ready
- Large touch targets (min 44px)
- Clear visual feedback

---

## Extending the Game

### Adding New Operations

1. Update `Operation` type in `types/game.ts`:
```typescript
export type Operation = '+' | '-' | '×' | '÷' | '%' | '^';
```

2. Add case in `generateQuestion()` in `lib/game-logic.ts`:
```typescript
case '%':
  // Modulo implementation
  break;
```

3. Update `LEVEL_CONFIGS` to include new operation

### Custom Themes/Skins

Add bubble themes in `components/Bubble.tsx`:
```typescript
const themes = {
  default: ['from-pink-400 to-pink-600', ...],
  ocean: ['from-blue-400 to-teal-600', ...],
  space: ['from-purple-900 to-pink-900', ...],
};
```

Store theme preference in settings.

### Multiplayer Mode

To add multiplayer:
1. Create new state slice for multiple players
2. Track scores separately
3. Alternate turns or race mode
4. Add lobby/room system if online

### Custom Sound Effects

Replace Web Audio API with audio files:
1. Add MP3/WAV files to `/public/sounds/`
2. Update `lib/audio.ts`:
```typescript
playCorrect() {
  const audio = new Audio('/sounds/correct.mp3');
  audio.play();
}
```

### Power-ups & Bonuses

Add to game state:
```typescript
interface GameState {
  // ... existing
  activePowerUps: PowerUp[];
  coins: number;
}
```

Examples:
- Time freeze (challenge mode)
- Extra hearts
- Double points
- Hint (show/highlight correct answer)

### Achievements System

Track in `storage.ts`:
```typescript
interface Achievements {
  perfectStreak10: boolean;
  level10Unlocked: boolean;
  gamesPlayed100: boolean;
  // ...
}
```

Show badges on main menu or profile screen.

---

## Performance Optimization

### Current Optimizations
- Static generation (SSG)
- Component code splitting
- Minimal bundle size (~146KB first load)
- CSS purging via Tailwind

### Future Improvements
- Image optimization (if adding custom graphics)
- Service worker for offline play
- Web Workers for complex calculations
- Preload audio files

---

## Testing

### Manual Testing Checklist

#### Gameplay
- [ ] Questions generate correctly for all levels
- [ ] Correct answers increment score
- [ ] Wrong answers reduce hearts (challenge mode)
- [ ] Streak counter works
- [ ] Level adaptation triggers appropriately
- [ ] Timer counts down (challenge mode)

#### UI/UX
- [ ] Bubbles animate smoothly
- [ ] Settings persist after reload
- [ ] Game over shows correct stats
- [ ] Best score updates
- [ ] Responsive on mobile/tablet/desktop

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces questions
- [ ] Reduce motion setting disables animations
- [ ] Focus indicators visible
- [ ] Color contrast sufficient

#### Cross-browser
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (desktop & iOS)
- [ ] Mobile browsers

### Adding Automated Tests

Install testing libraries:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

Example test for `game-logic.ts`:
```typescript
import { generateQuestion, generateBubbles } from '@/lib/game-logic';

describe('generateQuestion', () => {
  it('generates valid addition question', () => {
    const question = generateQuestion('+', 0, 10);
    expect(question.correctAnswer).toBe(question.operands[0] + question.operands[1]);
  });
});
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Static Export

```bash
npm run build
npx serve@latest out
```

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Troubleshooting

### "Audio not playing"
- User must interact with page first (browser security)
- Check `soundOn` setting is true
- Verify AudioContext initialized

### "Voice prompts not working"
- Browser support varies (best on Chrome/Edge)
- Requires `voiceOn` setting enabled
- May need language pack installed

### "Build fails with TypeScript errors"
- Run `npm run build` to see specific errors
- Check all imports are correct
- Ensure types match interfaces

### "Animations laggy on mobile"
- Enable "Reduce Motion" setting
- Reduce bubble count
- Check device performance

---

## Future Enhancements

### Short-term
- [ ] More visual feedback (confetti, stars)
- [ ] Customizable bubble colors
- [ ] Daily challenges
- [ ] Parent dashboard (track progress)

### Medium-term
- [ ] Word problems mode
- [ ] Story mode with progression
- [ ] Printable worksheets generator
- [ ] Teacher mode with classroom analytics

### Long-term
- [ ] Multiplayer races
- [ ] Mobile app (React Native)
- [ ] Leaderboards
- [ ] AI tutor integration

---

## Contributing

When adding features:
1. Follow existing code structure
2. Add TypeScript types
3. Update this guide
4. Test accessibility
5. Ensure mobile responsive
6. Run `npm run build` to verify

---

## License

MIT - Feel free to use, modify, and distribute!

---

## Support

For questions or issues, check:
- Next.js docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
- Zustand: https://docs.pmnd.rs/zustand/

Happy coding! 🎈🔢
