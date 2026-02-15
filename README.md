# Kids Math Games 🎮🔢

Two fun, interactive math games for kids aged 4-10!

**✅ Status**: Fully functional and production-ready!

**🎮 Play Now**: Start the dev server and visit [http://localhost:3000](http://localhost:3000)

## Games

### 🎈 Bubble Pop Math
Pop bubbles with the correct answer! Practice addition, subtraction, multiplication, and division.

- **10 Difficulty Levels**: From counting basics to master level
- **Two Game Modes**: Practice (no timer) and Challenge (timed)
- **Adaptive Difficulty**: Automatically adjusts based on performance
- **Operations**: +, -, ×, ÷

### 🍎 Fruit Shop Money Math
Drag and drop coins to pay for fruit orders! Learn money counting and multiplication.

- **10 Difficulty Levels**: From $1 coins to $20 bills
- **Touch-Friendly**: Drag-and-drop or tap coins
- **Money Skills**: Counting coins, making change, multiplication
- **Two Modes**: Practice (unlimited time) and Time Attack (60-120 seconds)
- **Smart Hints**: Get help when you need it

## Features

- **Kid-Friendly Design**: Big buttons, bright colors, encouraging feedback
- **Progress Tracking**: Local storage of scores and achievements
- **Mobile Friendly**: Works great on tablets and phones
- **No Ads**: Safe, distraction-free learning environment
- **Offline Ready**: Play without internet connection

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Game Modes

### Practice Mode (Both Games)
- No timer
- No game over
- Perfect for learning
- Gentle feedback
- Focus on understanding

### Challenge / Time Attack Mode
- Timed gameplay (30-120 seconds)
- Score multipliers & streaks
- Track best scores
- More competitive
- Build speed and accuracy

## Difficulty Levels

### Bubble Pop Math

| Level | Operations | Range | Description |
|------:|------------|------:|-------------|
| 1 | Addition | 0-5 | Counting basics |
| 2 | Addition | 0-10 | Simple addition |
| 3 | Subtraction | 0-10 | Basic subtraction |
| 4 | +, - | 0-20 | Mixed operations |
| 5 | Multiplication | 0-5 | Times tables intro |
| 6 | Multiplication | 0-10 | Extended multiplication |
| 7 | Division | 0-50 | Simple division |
| 8 | +, - | 0-100 | Larger numbers |
| 9 | Multiplication | 0-12 | Complete times tables |
| 10 | All | 0-100 | Master level |

### Fruit Shop Money Math

| Level | Age | Coins Available | Max Total | Description |
|------:|----:|-----------------|----------:|-------------|
| 1-3 | 4-5 | $1, $2 | $10 | Counting to 10 |
| 4-6 | 6-7 | $1, $2, $5 | $30 | Counting by 2s and 5s |
| 7-10 | 8-10 | $1, $2, $5, $10, $20 | $80 | Advanced multiplication |

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Game selection menu
│   ├── bubble-pop/
│   │   └── page.tsx            # Bubble Pop game
│   ├── fruit-shop/
│   │   └── page.tsx            # Fruit Shop game
│   └── globals.css             # Global styles
├── components/
│   ├── Bubble.tsx              # Bubble component
│   ├── GameScreen.tsx          # Bubble Pop game view
│   ├── Settings.tsx            # Bubble Pop settings
│   ├── GameOver.tsx            # Bubble Pop game over
│   ├── Coin.tsx                # Coin component
│   ├── CoinBank.tsx            # Coin bank display
│   ├── PaymentTray.tsx         # Payment tray for coins
│   ├── OrderCard.tsx           # Fruit order display
│   ├── FruitShopGameScreen.tsx # Fruit Shop game view
│   ├── FruitShopSettings.tsx   # Fruit Shop settings
│   └── FruitShopGameOver.tsx   # Fruit Shop game over
├── lib/
│   ├── game-logic.ts           # Bubble Pop logic
│   ├── fruit-shop-logic.ts     # Fruit Shop logic
│   ├── audio.ts                # Sound effects
│   ├── storage.ts              # Bubble Pop storage
│   └── fruit-shop-storage.ts   # Fruit Shop storage
├── store/
│   ├── game-store.ts           # Bubble Pop state
│   └── fruit-shop-store.ts     # Fruit Shop state
└── types/
    ├── game.ts                 # Bubble Pop types
    └── fruit-shop.ts           # Fruit Shop types
```

## Quick Links

- **[STATUS.md](STATUS.md)** - Complete project status and overview
- **[QUICKSTART.md](QUICKSTART.md)** - How to play (for players/parents/teachers)
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Developer guide and extensions
- **[FEATURE_CHECKLIST.md](FEATURE_CHECKLIST.md)** - Spec compliance verification
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Comprehensive feature list

## License

MIT - Free to use, modify, and distribute!
