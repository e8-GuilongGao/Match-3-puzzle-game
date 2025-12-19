export class AudioManager {
  private ctx: AudioContext;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;

  constructor() {
    // @ts-ignore
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.connect(this.ctx.destination);
    this.bgmGain.gain.value = 0.1; // Low volume for background
  }

  public startBGM() {
    if (this.isPlaying || this.isMuted) return;
    this.isPlaying = true;
    this.ctx.resume();

    // BGM removed as per request (was causing "electric" hum)
    /*
    // Create a simple ambient drone
    const freqs = [220, 330, 440]; // A major chord
    freqs.forEach(f => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        
        // LFO for some movement
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1 + Math.random() * 0.5;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 5;
        lfo.connect(lfoGain.gain);
        // lfoGain.connect(osc.frequency); // Simple vibrato

        osc.connect(this.bgmGain);
        osc.start();
        this.bgmOscillators.push(osc);
    });
    */
  } public stopBGM() {
    this.bgmOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) { /* ignore */ }
    });
    this.bgmOscillators = [];
    this.isPlaying = false;
  }

  public playSwapSound() {
    if (this.isMuted) return;
    this.playTone(400, 'triangle', 0.1);
  }

  public playMatchSound() {
    if (this.isMuted) return;
    this.playTone(600, 'sine', 0.1);
    setTimeout(() => this.playTone(800, 'sine', 0.1), 100);
  }

  public playErrorSound() {
    if (this.isMuted) return;
    this.playTone(150, 'triangle', 0.2);
  } private playTone(freq: number, type: OscillatorType, duration: number) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.bgmGain.gain.setValueAtTime(0, this.ctx.currentTime);
    } else {
      this.bgmGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      if (!this.isPlaying) {
        this.startBGM();
      }
    }
  }
}
