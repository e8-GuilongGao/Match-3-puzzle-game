import { Board } from './Board';
import { Tile } from './Tile';
import { TILE_SIZE, COLORS } from './Constants';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public draw(board: Board, selectedTile: Tile | null, score: number, moves: number, level: number, target: number, fruits: string[]) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Background
    this.ctx.fillStyle = '#222';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw UI
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '24px Arial';
    this.ctx.fillText(`Level: ${level}`, 20, 40);
    this.ctx.fillText(`Score: ${score} / ${target}`, 20, 70);
    this.ctx.fillText(`Moves: ${moves}`, 20, 100);

    // Center the grid
    const gridWidth = board.width * TILE_SIZE;
    const gridHeight = board.height * TILE_SIZE;
    const startX = (this.canvas.width - gridWidth) / 2;
    const startY = (this.canvas.height - gridHeight) / 2 + 50;

    // Draw Grid Background
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(startX - 5, startY - 5, gridWidth + 10, gridHeight + 10);

    // Draw Tiles
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const tile = board.getTile(x, y);
        if (tile) {
          this.drawTile(tile, startX, startY, tile === selectedTile, fruits);
        }
      }
    }
  }

  private drawTile(tile: Tile, startX: number, startY: number, isSelected: boolean, fruits: string[]) {
    const x = startX + tile.x * TILE_SIZE + tile.offsetX;
    const y = startY + tile.y * TILE_SIZE + tile.offsetY;
    const size = TILE_SIZE - 4;

    this.ctx.save();
    this.ctx.translate(x + 2, y + 2);

    // Scale for animation
    if (tile.scale !== 1) {
      this.ctx.translate(size / 2, size / 2);
      this.ctx.scale(tile.scale, tile.scale);
      this.ctx.translate(-size / 2, -size / 2);
    }

    // Glow effect
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = COLORS[tile.type];

    // Draw shape (Rounded Rect) - Background
    this.ctx.fillStyle = COLORS[tile.type];
    this.ctx.globalAlpha = 0.2; // Semi-transparent background
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, size, size, 12);
    this.ctx.fill();
    this.ctx.globalAlpha = 1.0;

    // Draw Fruit
    this.ctx.shadowBlur = 0; // No shadow for text to keep it crisp
    this.ctx.font = `${size * 0.65}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(fruits[tile.type], size / 2, size / 2 + size * 0.05);

    // Inner shine
    /*
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.ellipse(size * 0.3, size * 0.3, size * 0.15, size * 0.1, Math.PI / 4, 0, Math.PI * 2);
    this.ctx.fill();
    */

    if (isSelected) {
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(-2, -2, size + 4, size + 4);
    }

    this.ctx.restore();
  }

  public drawMessage(text: string, subtext: string = "") {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2 - 20);

    if (subtext) {
      this.ctx.font = '24px Arial';
      this.ctx.fillText(subtext, this.canvas.width / 2, this.canvas.height / 2 + 30);
    }
    this.ctx.textAlign = 'left'; // Reset
  }
}
