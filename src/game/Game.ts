import { Board } from './Board';
import { Renderer } from './Renderer';
import { Input } from './Input';
import { LevelManager } from './LevelManager';
import { AudioManager } from './AudioManager';
import { GameState, TILE_SIZE } from './Constants';
import { Tile } from './Tile';

export class Game {
  private board!: Board;
  private renderer: Renderer;
  // @ts-ignore
  private input: Input;
  private levelManager: LevelManager;
  private audioManager: AudioManager;
  private state: GameState; private selectedTile: Tile | null = null;
  private score: number = 0;
  private movesLeft: number = 0;
  private targetScore: number = 0;
  private currentFruits: string[] = [];

  private lastTime: number = 0;
  // @ts-ignore
  private animationQueue: (() => boolean)[] = []; // Functions that return true when done

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.levelManager = new LevelManager();
    this.audioManager = new AudioManager();
    this.input = new Input(canvas, this.handleInput.bind(this));
    this.state = GameState.MENU;

    // Start BGM on first interaction to comply with browser autoplay policies
    const startAudio = () => {
      this.audioManager.startBGM();
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
    window.addEventListener('click', startAudio);
    window.addEventListener('touchstart', startAudio);

    this.startLevel(1);
    this.loop(0);
  } private startLevel(levelNum: number) {
    const config = this.levelManager.getLevelConfig(levelNum);
    this.board = new Board(config);
    this.score = 0;
    this.movesLeft = config.moves;
    this.targetScore = config.targetScore;
    this.currentFruits = config.fruits;
    this.state = GameState.PLAYING;
    this.selectedTile = null;
    this.animationQueue = [];

    // Initial check for matches (should be handled by Board init, but just in case)
    this.resolveMatches();
  }

  private handleInput(x: number, y: number) {
    if (this.state !== GameState.PLAYING) {
      if (this.state === GameState.LEVEL_COMPLETE) {
        if (this.levelManager.nextLevel()) {
          this.startLevel(this.levelManager.getCurrentLevel());
        } else {
          // Victory!
          this.levelManager.reset();
          this.startLevel(1);
        }
      } else if (this.state === GameState.GAME_OVER) {
        this.levelManager.reset();
        this.startLevel(1);
      }
      return;
    }

    // Calculate grid position
    // We need to duplicate the centering logic from Renderer or store it.
    // Let's recalculate it here for simplicity.
    const gridWidth = this.board.width * TILE_SIZE;
    const gridHeight = this.board.height * TILE_SIZE;
    const startX = (this.renderer['canvas'].width - gridWidth) / 2;
    const startY = (this.renderer['canvas'].height - gridHeight) / 2 + 50;

    const gridX = Math.floor((x - startX) / TILE_SIZE);
    const gridY = Math.floor((y - startY) / TILE_SIZE);

    const tile = this.board.getTile(gridX, gridY);
    if (!tile) return;

    if (!this.selectedTile) {
      this.selectedTile = tile;
    } else {
      if (this.selectedTile === tile) {
        this.selectedTile = null;
      } else {
        // Check adjacency
        const dx = Math.abs(this.selectedTile.x - tile.x);
        const dy = Math.abs(this.selectedTile.y - tile.y);

        if (dx + dy === 1) {
          this.attemptSwap(this.selectedTile, tile);
          this.selectedTile = null;
        } else {
          this.selectedTile = tile;
        }
      }
    }
  }

  private attemptSwap(t1: Tile, t2: Tile) {
    this.state = GameState.ANIMATING;
    this.audioManager.playSwapSound();

    // Swap logic
    this.board.swap(t1.x, t1.y, t2.x, t2.y);

    // Check matches
    const matches = this.board.findMatches();

    if (matches.length > 0) {
      this.movesLeft--;
      this.processMatches(matches);
    } else {
      // Swap back
      this.audioManager.playErrorSound();
      // Add animation delay here if we had real animations
      setTimeout(() => {
        this.board.swap(t1.x, t1.y, t2.x, t2.y);
        this.state = GameState.PLAYING;
      }, 300);
    }
  }

  private processMatches(matches: Tile[]) {
    // 1. Remove matches
    this.score += matches.length * 100;
    this.audioManager.playMatchSound();
    this.board.removeMatches(matches);    // 2. Drop tiles
    setTimeout(() => {
      this.board.applyGravity();

      // 3. Check for new matches
      const newMatches = this.board.findMatches();
      if (newMatches.length > 0) {
        this.processMatches(newMatches);
      } else {
        this.checkWinCondition();
      }
    }, 300);
  }

  private resolveMatches() {
    // Helper to clear initial board if needed, though Board.init handles it.
  }

  private checkWinCondition() {
    if (this.score >= this.targetScore) {
      this.state = GameState.LEVEL_COMPLETE;
    } else if (this.movesLeft <= 0) {
      this.state = GameState.GAME_OVER;
    } else {
      this.state = GameState.PLAYING;
    }
  }

  private loop(timestamp: number) {
    // @ts-ignore
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // Update animations here if we had them

    // Draw
    this.renderer.draw(
      this.board,
      this.selectedTile,
      this.score,
      this.movesLeft,
      this.levelManager.getCurrentLevel(),
      this.targetScore,
      this.currentFruits
    );

    if (this.state === GameState.LEVEL_COMPLETE) {
      this.renderer.drawMessage("Level Complete!", "Click to continue");
    } else if (this.state === GameState.GAME_OVER) {
      this.renderer.drawMessage("Game Over", "Click to restart");
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}
