import { ALL_FRUITS } from './Constants';

export interface LevelConfig {
  levelNumber: number;
  width: number;
  height: number;
  targetScore: number;
  moves: number;
  colorCount: number;
  fruits: string[];
}

export class LevelManager {
  private currentLevel: number = 1;
  private maxLevels: number = 30;

  public getLevelConfig(level: number): LevelConfig {
    // Difficulty progression logic
    // Level 1: 3 colors, 1000 pts, 20 moves
    // Level 30: 6 colors, high score, fewer moves? Or just harder to match.

    const colorCount = Math.min(6, 3 + Math.floor((level - 1) / 5));
    const moves = Math.max(15, 25 - Math.floor((level - 1) / 2)); // Start with 25, decrease slowly
    const targetScore = 1000 + (level - 1) * 1500;

    // Select fruits for this level
    const fruits: string[] = [];
    // Simple deterministic selection based on level
    // We want different sets for different levels
    const availableFruits = [...ALL_FRUITS];

    // Pseudo-random generator based on level
    let seed = level * 1337;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Shuffle available fruits
    for (let i = availableFruits.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [availableFruits[i], availableFruits[j]] = [availableFruits[j], availableFruits[i]];
    }

    for (let i = 0; i < colorCount; i++) {
      fruits.push(availableFruits[i]);
    }

    return {
      levelNumber: level,
      width: 8,
      height: 8,
      targetScore: targetScore,
      moves: moves,
      colorCount: colorCount,
      fruits: fruits
    };
  } public getCurrentLevel(): number {
    return this.currentLevel;
  }

  public nextLevel(): boolean {
    if (this.currentLevel < this.maxLevels) {
      this.currentLevel++;
      return true;
    }
    return false;
  }

  public reset(): void {
    this.currentLevel = 1;
  }
}
