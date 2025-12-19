import { Tile } from './Tile';
import type { LevelConfig } from './LevelManager';

export class Board {
  public width: number;
  public height: number;
  public tiles: (Tile | null)[][];
  private colorCount: number;

  constructor(config: LevelConfig) {
    this.width = config.width;
    this.height = config.height;
    this.colorCount = config.colorCount;
    this.tiles = [];
    this.initBoard();
  }

  private initBoard() {
    this.tiles = [];
    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x++) {
        let type;
        do {
          type = Math.floor(Math.random() * this.colorCount);
        } while (
          (x >= 2 && this.tiles[y][x - 1]?.type === type && this.tiles[y][x - 2]?.type === type) ||
          (y >= 2 && this.tiles[y - 1][x]?.type === type && this.tiles[y - 2][x]?.type === type)
        );
        this.tiles[y][x] = new Tile(x, y, type);
      }
    }
  }

  public getTile(x: number, y: number): Tile | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.tiles[y][x];
  }

  public swap(x1: number, y1: number, x2: number, y2: number) {
    const tile1 = this.tiles[y1][x1];
    const tile2 = this.tiles[y2][x2];

    if (tile1 && tile2) {
      this.tiles[y1][x1] = tile2;
      this.tiles[y2][x2] = tile1;
      tile1.x = x2;
      tile1.y = y2;
      tile2.x = x1;
      tile2.y = y1;
    }
  }

  public findMatches(): Tile[] {
    const matches: Set<Tile> = new Set();

    // Horizontal
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width - 2; x++) {
        const t1 = this.tiles[y][x];
        const t2 = this.tiles[y][x + 1];
        const t3 = this.tiles[y][x + 2];
        if (t1 && t2 && t3 && t1.type === t2.type && t1.type === t3.type) {
          matches.add(t1);
          matches.add(t2);
          matches.add(t3);
        }
      }
    }

    // Vertical
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height - 2; y++) {
        const t1 = this.tiles[y][x];
        const t2 = this.tiles[y + 1][x];
        const t3 = this.tiles[y + 2][x];
        if (t1 && t2 && t3 && t1.type === t2.type && t1.type === t3.type) {
          matches.add(t1);
          matches.add(t2);
          matches.add(t3);
        }
      }
    }

    return Array.from(matches);
  }

  public removeMatches(matches: Tile[]) {
    matches.forEach(t => {
      this.tiles[t.y][t.x] = null;
    });
  }

  public applyGravity(): { moved: boolean, newTiles: Tile[] } {
    let moved = false;
    const newTiles: Tile[] = [];

    // Shift down
    for (let x = 0; x < this.width; x++) {
      for (let y = this.height - 1; y >= 0; y--) {
        if (this.tiles[y][x] === null) {
          // Find nearest tile above
          for (let k = y - 1; k >= 0; k--) {
            if (this.tiles[k][x] !== null) {
              this.tiles[y][x] = this.tiles[k][x];
              this.tiles[k][x] = null;
              if (this.tiles[y][x]) {
                this.tiles[y][x]!.y = y; // Update logical position
                // Visual offset handled in renderer/game loop
                moved = true;
              }
              break;
            }
          }
        }
      }
    }

    // Fill top
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.tiles[y][x] === null) {
          const type = Math.floor(Math.random() * this.colorCount);
          const tile = new Tile(x, y, type);
          this.tiles[y][x] = tile;
          newTiles.push(tile);
          moved = true;
        }
      }
    }

    return { moved, newTiles };
  }
}
