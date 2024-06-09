import './style.css'

import { setupGame } from './setup.ts'
import { startGame } from './game.ts'

const gameCtx = setupGame(document.getElementById('app')!);

const validKeys = ['Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

function onKeydown(e: KeyboardEvent) {
  if (!validKeys.includes(e.key)) return;

  startGame(gameCtx);
  document.removeEventListener('keydown', onKeydown);
}

document.addEventListener('keydown', onKeydown);

