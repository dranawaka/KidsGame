# Target Shoot Math Game - Complete Guide

## Overview

Target Shoot is an action-packed math game where players shoot moving targets with the correct answer. Perfect for building math fluency under light time pressure!

---

## Game Concept

A math question appears at the top of the screen. Multiple targets move across the play area, each showing a different number. Players click/tap the target with the correct answer to score points.

**Correct Hit**: Explosion effect, celebration animation, +10 points + streak bonus  
**Wrong Hit**: Gentle feedback, streak resets, brief pause before next question

---

## Learning Goals

- **Fast Recall**: Quick mental math calculation
- **Focus & Attention**: Track multiple moving targets
- **Decision Making**: Choose correct answer under pressure
- **Math Confidence**: Build fluency through repetition

---

## Game Modes

### 🎯 Practice Mode
- No timer
- Unlimited time per question
- Gentle learning environment
- Perfect for beginners
- Focus on accuracy over speed

### ⏱️ Time Attack Mode
- 60-second timer (customizable: 30/60/90/120s)
- Score as many points as possible
- Time bonus at the end
- More competitive gameplay
- Builds speed and accuracy

---

## Difficulty Levels (1-10)

| Level | Operations | Range | Speed | Description |
|-------|-----------|-------|-------|-------------|
| 1 | + | 0-5 | Slow | Simple addition (0-5) |
| 2 | + | 0-10 | Slow | Addition (0-10) |
| 3 | - | 0-10 | Slow | Subtraction (0-10) |
| 4 | +, - | 0-20 | Medium | Mixed +/- (0-20) |
| 5 | × | 0-5 | Medium | Multiplication (0-5) |
| 6 | × | 0-10 | Medium | Multiplication (0-10) |
| 7 | ÷ | 0-50 | Fast | Division |
| 8 | +, -, × | 0-100 | Fast | Mixed operations (0-100) |
| 9 | × | 0-12 | Fast | Times tables (0-12) |
| 10 | +, -, ×, ÷ | 0-100 | Fast | Master level |

**Adaptive Difficulty**: The game automatically adjusts level based on your accuracy!
- > 85% accuracy → Level up
- < 55% accuracy → Level down

---

## Gameplay Features

### Scoring System
- **Correct Answer**: +10 points
- **Streak Bonus**: +min(streak, 10) points per correct answer
- **Time Bonus** (Time Attack): +1 point per second remaining

### Visual Feedback
- **Correct Hit**: 
  - Target explodes with particles
  - Star burst animation
  - Confetti celebration
  - Green checkmark
  - Happy sound effect

- **Wrong Hit**:
  - Red X animation
  - Small shake effect
  - Gentle sound
  - Brief pause

- **Streak Effects**:
  - 5+ streak: Flame trail effects
  - 10+ streak: Screen glow with floating stars

### Target Motion
- Targets move horizontally across the screen
- Realistic bouncing with velocity reversal
- Bounce dampening (95% horizontal, 80% vertical)
- Slight vertical bobbing for variety
- Gravity effect for natural motion
- Speed increases with difficulty level
- User-controlled speed multiplier (0.4x - 2.0x)
- 6-10 targets on screen at once

---

## Controls

### Desktop
- **Mouse Click**: Shoot target
- **Hover**: Targets enlarge slightly
- **Crosshair Cursor**: Enhanced targeting feedback

### Mobile/Tablet
- **Tap**: Directly tap the target to shoot
- **Touch-Friendly**: Large targets (64px+)
- **Responsive**: Optimized for all screen sizes

---

## Settings & Customization

### Game Settings
- **Mode**: Practice or Time Attack
- **Starting Level**: 1-10
- **Target Count**: 6, 8, or 10 targets
- **Timer Duration**: 30/60/90/120 seconds (Time Attack only)
- **Target Speed**: 5 speed options (Very Slow to Very Fast)

### Target Speed Control 🎯
Control how fast targets move independently of difficulty level:

- 🐌 **Very Slow** (0.4x) - Perfect for young children (ages 4-5) or learning
- 🚶 **Slow** (0.7x) - Easier tracking, builds confidence (ages 6-7)
- 🏃 **Normal** (1.0x) - Default balanced speed (ages 8+)
- 🚀 **Fast** (1.4x) - More challenging for advanced players
- ⚡ **Very Fast** (2.0x) - Expert mode for reflex testing

**How it works**: Final speed = Level Speed × User Speed Setting

**Examples**:
- Level 3 + Very Slow = Gentle learning pace
- Level 5 + Normal = Balanced gameplay
- Level 10 + Very Fast = Maximum challenge!

### Audio & Visual
- **Sound Effects**: Toggle on/off
- **Reduce Motion**: Slower animations for accessibility

---

## Statistics & Progress

### Session Stats (Game Over Screen)
- Final Score (with new record indicator)
- Correct Answers
- Wrong Answers
- Accuracy Percentage
- Best Streak

### All-Time Stats
- Total Games Played
- Best Score Ever
- Best Streak Ever
- Saved automatically to browser

---

## Educational Benefits

### Math Skills
- **Number Recognition**: Quick identification of numbers
- **Mental Math**: Calculate answers without writing
- **Operation Fluency**: Practice +, -, ×, ÷
- **Speed Building**: Improve calculation speed

### Cognitive Skills
- **Focus**: Track multiple moving objects
- **Hand-Eye Coordination**: Click/tap moving targets
- **Decision Making**: Choose correct answer quickly
- **Working Memory**: Hold question in mind while scanning

---

## Tips for Players

### For Beginners
1. Start with Practice Mode
2. Choose Level 1 or 2
3. Use fewer targets (6)
4. **Set speed to Very Slow or Slow** 🐌
5. Focus on accuracy over speed
6. Take your time!

### For Advanced Players
1. Try Time Attack Mode
2. Challenge yourself with Level 8-10
3. Use 10 targets for more difficulty
4. **Set speed to Fast or Very Fast** ⚡
5. Set shorter time limits
6. Aim for high streaks!

### Streaks Strategy
- Stay calm and focused
- Read the question carefully
- Scan all targets before shooting
- Build accuracy first, then speed

---

## Technical Features

### Performance
- **60 FPS Animation**: Smooth target movement
- **RequestAnimationFrame**: Efficient rendering
- **No Game Engine**: Pure React + Framer Motion
- **Lightweight**: Fast loading times

### Accessibility
- **Keyboard Support**: Full keyboard navigation
- **ARIA Labels**: Screen reader friendly
- **Large Targets**: Minimum 48px touch targets
- **Reduce Motion**: Optional slower animations
- **Color Contrast**: WCAG compliant

### Storage
- **Local Storage**: Progress saved automatically
- **No Account**: Play instantly
- **Privacy First**: All data stays on your device

---

## Architecture

### Built With
- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Framer Motion**: Smooth animations
- **Zustand**: State management
- **Web Audio API**: Sound effects

### File Structure
```
types/target-shoot.ts          # Type definitions
lib/target-shoot-logic.ts      # Game logic & question generation
lib/target-shoot-storage.ts    # LocalStorage persistence
store/target-shoot-store.ts    # Zustand state management
components/Target.tsx          # Target component with effects
components/TargetShootGameScreen.tsx    # Main game screen
components/TargetShootSettings.tsx      # Settings modal
components/TargetShootGameOver.tsx      # Game over screen
app/target-shoot/page.tsx      # Game route
```

---

## Question Generation

### Smart Distractors
Wrong answers are carefully designed to be plausible:

**Addition Example**: 7 + 5 = ?
- Correct: 12
- Distractors: 11, 13, 10, 2 (subtraction), 35 (multiplication)

**Multiplication Example**: 7 × 4 = ?
- Correct: 28
- Distractors: 11 (addition), 21 (×3), 32 (×8), 27, 29 (near misses)

### No Duplicates
- All targets show unique numbers
- Exactly one correct answer
- Distractors based on common mistakes

---

## Best Practices for Teachers/Parents

### Classroom Use
- Set appropriate starting level for class
- Use Practice Mode for assessments
- Time Attack for competitive games
- Track improvement over sessions

### Home Use
- 10-15 minutes daily for consistency
- Celebrate improvements, not just scores
- Mix with other games for variety
- Adjust difficulty as needed

### Age Recommendations
- **4-6 years**: Levels 1-3 (Practice Mode)
- **7-8 years**: Levels 3-5 (Practice or Time Attack)
- **9-10 years**: Levels 5-8 (Time Attack)
- **10+ years**: Levels 8-10 (Time Attack, high difficulty)

---

## Troubleshooting

### Targets Too Fast
- Reduce target speed setting (use Slow or Very Slow)
- Reduce level
- Enable "Reduce Motion"
- Use Practice Mode first

### Targets Too Slow
- Increase target speed setting (use Fast or Very Fast)
- Increase level
- Try Time Attack mode
- Use 10 targets for more challenge

### Sound Not Working
- Check browser permissions
- Unmute device
- Toggle sound in settings

### Performance Issues
- Enable "Reduce Motion"
- Close other browser tabs
- Try different browser (Chrome recommended)

---

## Future Enhancements

Potential additions:
- Power-ups (freeze time, show answer)
- Different target shapes
- Themed backgrounds
- Multiplayer mode
- Daily challenges
- Achievement badges
- Custom difficulty curves

---

## Credits

Built with ❤️ for kids who love math!

**License**: MIT - Free to use, modify, and distribute

---

## Support

For questions or feedback:
- Check main README.md
- Review DEVELOPMENT.md for technical details
- See other game guides (Bubble Pop, Fruit Shop)

---

**Have fun shooting targets and mastering math!** 🎯🔢✨
