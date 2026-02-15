# Quick Start Guide - Bubble Pop Math

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Game Controls

### Mouse/Touch
- Click/tap any bubble to pop it

### Keyboard
- Press number keys **1-9** to select bubbles (numbered on screen)
- **Tab** to navigate between buttons
- **Enter/Space** to activate buttons

## Settings

Click the ⚙️ Settings button on the main menu to customize:

### Game Mode
- **Practice**: No timer, unlimited hearts, perfect for learning
- **Challenge**: Beat the clock, limited hearts, competitive scoring

### Difficulty Level (1-10)
| Level | What's Inside |
|-------|---------------|
| 1-2   | Simple addition (0-10) |
| 3-4   | Addition and subtraction (0-20) |
| 5-6   | Multiplication tables |
| 7     | Division |
| 8-10  | Mixed operations, larger numbers |

The game automatically adjusts difficulty based on your performance!

### Other Options
- **Bubble Count**: More bubbles = harder (6-12)
- **Timer**: How long you have in Challenge mode (30-180 seconds)
- **Hearts**: Lives in Challenge mode (1-5)
- **Sound Effects**: Toggle game sounds
- **Voice Prompts**: Hear questions read aloud
- **Reduce Motion**: Turn off animations for accessibility

## Scoring

- **Correct answer**: +10 points
- **Streak bonus**: +2 × current streak (max +20)
- **Wrong answer**: -2 points in Challenge mode, 0 in Practice mode

## Stars & Achievements

At the end of each game:
- **0-49 points**: 1 star ⭐
- **50-99 points**: 2 stars ⭐⭐
- **100+ points**: 3 stars ⭐⭐⭐

Track your best score and overall accuracy on the main menu!

## Tips for Parents/Teachers

### For Young Learners (Ages 4-5)
- Start at **Level 1-2** (counting and simple addition)
- Use **Practice mode** with no pressure
- Enable **Voice Prompts** to hear questions
- Reduce bubble count to **6-7** for less overwhelm

### For Elementary Students (Ages 6-8)
- Try **Level 3-6** (addition, subtraction, multiplication)
- Mix Practice and Challenge mode
- Gradually increase bubble count
- Track accuracy over time

### For Advanced Students (Ages 9-10)
- Challenge them with **Level 7-10**
- Use Challenge mode with timer
- Set goals for best scores
- Introduce mixed operations

### Accessibility Features
- Full keyboard navigation for motor difficulties
- Screen reader support for visual impairments
- Reduce motion option for sensory sensitivities
- Large touch targets (44px minimum)
- High contrast colors

## Troubleshooting

**Q: Sounds aren't playing?**
- Check that Sound Effects are enabled in Settings
- Make sure your device volume is up
- Some browsers require user interaction first

**Q: Voice prompts not working?**
- Enable Voice Prompts in Settings
- Check browser permissions for speech
- Works best in Chrome/Edge

**Q: Game is laggy on my device?**
- Enable "Reduce Motion" in Settings
- Decrease bubble count
- Close other browser tabs

**Q: Can I play offline?**
- Yes! Once loaded, the game works offline
- Your scores and settings are saved locally

**Q: How do I reset my progress?**
- Currently stored in browser localStorage
- Clear browser data to reset
- Or just start a new game anytime!

## Browser Support

Works best in:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (desktop & iOS)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Educational Value

This game helps children practice:
- **Number recognition**
- **Basic arithmetic** (addition, subtraction, multiplication, division)
- **Mental math** speed and accuracy
- **Pattern recognition**
- **Problem-solving** under time pressure (Challenge mode)
- **Growth mindset** through adaptive difficulty

## Privacy

- No data is collected or sent to servers
- All scores and settings stored locally in your browser
- No ads, no tracking, no sign-ups required

---

Enjoy playing! 🎈🔢✨

For more technical details, see [DEVELOPMENT.md](./DEVELOPMENT.md)
