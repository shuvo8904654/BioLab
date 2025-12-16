class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled) return;
    this.init();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playClick() {
    this.playTone(800, 0.05, 'square', 0.1);
  }

  playSuccess() {
    this.init();
    if (!this.enabled) return;

    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.2), i * 100);
    });
  }

  playMutation() {
    this.init();
    if (!this.enabled) return;

    this.playTone(200, 0.1, 'sawtooth', 0.15);
    setTimeout(() => this.playTone(150, 0.15, 'sawtooth', 0.1), 50);
  }

  playCrossover() {
    this.init();
    if (!this.enabled) return;

    const notes = [392, 440, 494, 523];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.12, 'triangle', 0.15), i * 80);
    });
  }

  playRandomize() {
    this.init();
    if (!this.enabled) return;

    for (let i = 0; i < 5; i++) {
      const freq = 300 + Math.random() * 400;
      setTimeout(() => this.playTone(freq, 0.05, 'square', 0.08), i * 40);
    }
  }

  playSelect() {
    this.playTone(600, 0.08, 'sine', 0.15);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

const soundManager = new SoundManager();
export default soundManager;
