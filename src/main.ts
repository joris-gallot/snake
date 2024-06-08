import './style.css'

import { setupGame } from './setup.ts'
import { startGame } from './game.ts'

const gameCtx = setupGame(document.getElementById('app')!);

const validKeys = ['Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (!validKeys.includes(e.key)) return;

  startGame(gameCtx);
}, {
  once: true
})

