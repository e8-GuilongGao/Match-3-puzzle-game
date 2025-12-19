

export class Input {
  private canvas: HTMLCanvasElement;
  private callback: (x: number, y: number) => void;

  constructor(canvas: HTMLCanvasElement, callback: (x: number, y: number) => void) {
    this.canvas = canvas;
    this.callback = callback;
    this.canvas.addEventListener('mousedown', this.handleInput.bind(this));
    this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
  }

  private handleInput(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    // We need to know the grid offset which is calculated in Renderer.
    // For simplicity, let's assume the Game class passes the grid offset or we calculate it here similarly.
    // Actually, it's better if we just pass raw coordinates to Game and let it decide.
    // But wait, Game needs to know where the grid is.
    // Let's pass the raw clientX/Y relative to canvas.

    this.callback(e.clientX - rect.left, e.clientY - rect.top);
  }

  private handleTouch(e: TouchEvent) {
    e.preventDefault(); // Prevent scrolling
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    this.callback(touch.clientX - rect.left, touch.clientY - rect.top);
  }
}
