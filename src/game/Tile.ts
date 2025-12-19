export class Tile {
  public x: number;
  public y: number;
  public type: number; // Index in COLORS array
  public offsetX: number = 0;
  public offsetY: number = 0;
  public alpha: number = 1;
  public scale: number = 1;
  public toDelete: boolean = false;

  constructor(x: number, y: number, type: number) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}
