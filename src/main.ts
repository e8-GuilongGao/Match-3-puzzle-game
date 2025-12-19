import './style.css'
import { Game } from './game/Game'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <canvas id="gameCanvas"></canvas>
`

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
new Game(canvas);
