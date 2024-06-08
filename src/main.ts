import './style.css'

import { setupGame } from './setup.ts'
import { startGame } from './game.ts'

const gameCtx = setupGame(document.getElementById('app')!);

startGame(gameCtx);
