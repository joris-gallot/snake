import type { GameContext } from './types';
import { newSnake } from './snake';
import { generateFood, updateGrid } from './game';

function setupGrid({ size, element }: { element: HTMLElement, size: number }) {
  const grid = document.createElement('div');
  grid.classList.add('snake-grid');
  grid.style.setProperty('--grid-size', size.toString());

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');

    const x = i % size;
    const y = Math.floor(i / size);

    cell.dataset.x = x.toString();
    cell.dataset.y = y.toString();

    cell.classList.add('cell');

    if ((x + y) % 2 === 0) {
      cell.classList.add('even');
    }

    grid.appendChild(cell);
  }

  return element.appendChild(grid);
}

export function setupGame(element: HTMLElement): GameContext {
  const GRID_SIZE = 16;
  const grid = setupGrid({ element, size: GRID_SIZE });

  const snake = newSnake({ size: 4, limit: GRID_SIZE - 1 })

  const gameContext: GameContext = {
    snake,
    grid,
    gridSize: GRID_SIZE,
    gameOver: false,
  }

  generateFood(gameContext);
  updateGrid(gameContext);

  return gameContext
}
