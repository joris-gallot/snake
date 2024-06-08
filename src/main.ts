import './style.css'

import { setupGame, startGame } from './setup.ts'

const gameCtx = setupGame(document.getElementById('app')!);

startGame(gameCtx);
