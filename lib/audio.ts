/**
 * Audio utilities for game sounds
 * Uses Web Audio API for sound effects
 */

class AudioManager {
  private context: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
        this.context = new AudioContext();
      } catch {
        console.warn('Web Audio API not supported');
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Play a correct answer sound (pleasant, encouraging)
   */
  playCorrect() {
    if (!this.enabled || !this.context) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    // Happy ascending tone
    oscillator.frequency.setValueAtTime(523.25, this.context.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, this.context.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, this.context.currentTime + 0.2); // G5

    gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + 0.3);
  }

  /**
   * Play an incorrect answer sound (gentle, non-harsh)
   */
  playIncorrect() {
    if (!this.enabled || !this.context) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    // Gentle descending tone
    oscillator.frequency.setValueAtTime(392, this.context.currentTime); // G4
    oscillator.frequency.setValueAtTime(349.23, this.context.currentTime + 0.15); // F4

    gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.25);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + 0.25);
  }

  /**
   * Play a bubble pop sound
   */
  playPop() {
    if (!this.enabled || !this.context) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.frequency.setValueAtTime(800, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + 0.1);
  }

  /**
   * Play celebration sound (level up, high score)
   */
  playCelebration() {
    if (!this.enabled || !this.context) return;

    const notes = [523.25, 587.33, 659.25, 783.99, 880.0]; // C5, D5, E5, G5, A5
    
    notes.forEach((freq, index) => {
      const oscillator = this.context!.createOscillator();
      const gainNode = this.context!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context!.destination);

      const startTime = this.context!.currentTime + index * 0.1;
      oscillator.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    });
  }

  /**
   * Play game over sound
   */
  playGameOver() {
    if (!this.enabled || !this.context) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    // Descending tone
    oscillator.frequency.setValueAtTime(440, this.context.currentTime); // A4
    oscillator.frequency.exponentialRampToValueAtTime(220, this.context.currentTime + 0.5); // A3

    gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + 0.5);
  }

  /**
   * Speak text using Web Speech API (if enabled)
   */
  speak(text: string, enabled: boolean = false) {
    if (!enabled || typeof window === 'undefined') return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    } catch {
      console.warn('Speech synthesis not supported');
    }
  }
}

// Singleton instance
export const audioManager = new AudioManager();
