import type { GameContext } from './types';
import { newSnake } from './snake';
import { generateFood, updateGrid } from './game';

function setupGrid({ size, element }: { element: HTMLElement, size: number }) {
  const grid = document.createElement('div');
  grid.id = 'game-grid';
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  grid.style.width = '700px';
  grid.style.height = '700px';

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');

    const x = i % size;
    const y = Math.floor(i / size);
    cell.id = `cell-${x}-${y}`;

    cell.style.border = '1px solid darkgreen';
    cell.style.backgroundColor = 'lightgreen';
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
  }

  generateFood(gameContext);
  updateGrid(gameContext);

  return gameContext
}
