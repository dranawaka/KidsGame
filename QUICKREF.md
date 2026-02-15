# 🚀 Quick Start - Kids Math Games

## Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Visit: **http://localhost:3000**

---

## 🎮 Game Overview

### Game Selection Menu (`/`)
Choose between two math games

### Bubble Pop Math (`/bubble-pop`) 🎈
- Pop bubbles with correct answers
- Practice: +, -, ×, ÷
- 10 levels, 2 modes
- Ages 4-10

### Fruit Shop (`/fruit-shop`) 🍎💰
- Drag coins to pay for fruit
- Practice: Money math & multiplication
- 10 levels, 2 modes
- Ages 4-10

---

## 📁 File Structure

```
app/
├── page.tsx              → Game selection menu
├── bubble-pop/page.tsx   → Bubble Pop game
└── fruit-shop/page.tsx   → Fruit Shop game

components/
├── [Bubble Pop components]
├── [Fruit Shop components]
└── [Shared components]

lib/
├── game-logic.ts           → Bubble Pop logic
├── fruit-shop-logic.ts     → Fruit Shop logic
└── storage.ts, audio.ts    → Utilities

store/
├── game-store.ts           → Bubble Pop state
└── fruit-shop-store.ts     → Fruit Shop state

types/
├── game.ts                 → Bubble Pop types
└── fruit-shop.ts           → Fruit Shop types
```

---

## 🔧 Key Settings

### Bubble Pop
- Mode: Practice / Challenge
- Level: 1-10
- Timer: 30-120s
- Operations: +, -, ×, ÷
- Bubbles: 6-12

### Fruit Shop
- Mode: Practice / Time Attack
- Level: 1-10
- Timer: 30-120s
- Coins: $1, $2, $5, $10, $20
- Hints: On/Off
- Exact Change: On/Off

---

## 💾 Data Storage

All data stored in browser localStorage:
- `bubble-pop-settings`
- `bubble-pop-stats`
- `fruit-shop-settings`
- `fruit-shop-stats`
- `fruit-shop-recent-items`

Clear data: Browser DevTools → Application → Local Storage

---

## 🎯 Quick Testing Checklist

### Both Games
- [ ] Select game from main menu
- [ ] Start Practice mode
- [ ] Start Challenge/Time Attack mode
- [ ] Adjust settings
- [ ] Check stats display
- [ ] Verify localStorage persistence
- [ ] Test on mobile/tablet

### Fruit Shop Specific
- [ ] Drag coins (desktop)
- [ ] Tap coins (mobile)
- [ ] Remove coins from tray
- [ ] Reset tray
- [ ] Submit correct payment
- [ ] Try wrong payment
- [ ] Use hints
- [ ] Test all 10 levels

---

## 🐛 Common Issues

### Dev Server Won't Start
```bash
# Try different port
npx next dev -p 3001
```

### Build Errors
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

### LocalStorage Issues
```bash
# Clear in browser console
localStorage.clear()
```

---

## 📚 Documentation

- **README.md** - Full project overview
- **FRUIT_SHOP_GUIDE.md** - Complete Fruit Shop guide
- **IMPLEMENTATION_SUMMARY.md** - Technical summary
- **STATUS.md** - Project status (existing)
- **DEVELOPMENT.md** - Developer guide (existing)

---

## 🎨 Customization

### Change Colors
Edit Tailwind config or component classes

### Add Items
Edit `FRUIT_ITEMS` in `types/fruit-shop.ts`

### Modify Levels
Edit `FRUIT_SHOP_LEVELS` in `types/fruit-shop.ts`

### Add Coins
Edit `COIN_DEFINITIONS` in `types/fruit-shop.ts`

---

## 📊 Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand

---

## ✅ Status

**Build**: ✅ Success  
**TypeScript**: ✅ All types valid  
**Linting**: ✅ No errors  
**Production**: ✅ Ready to deploy

---

## 🚀 Deploy

### Vercel (Recommended)
```bash
vercel deploy
```

### Other Platforms
Build static files:
```bash
npm run build
# Deploy .next folder
```

---

## 🎉 You're Ready!

Two complete math games, fully functional and production-ready.

Have fun learning! 🎮📚
