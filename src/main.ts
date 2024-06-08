import './style.css'

import { setupGame } from './setup.ts'
import { startGame } from './game.ts'

const gameCtx = setupGame(document.getElementById('app')!);

document.addEventListener('keydown', () => {
  if (!gameCtx || gameCtx.started) return;

  startGame(gameCtx);
})

