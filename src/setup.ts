import type { GameContext, SnakeDirection } from './types';
import { newSnake } from './snake';

function setupGrid(element: HTMLElement, gridSize: number) {
  const grid = document.createElement('div');
  grid.id = 'game-grid';
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  grid.style.width = '700px';
  grid.style.height = '700px';

  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');

    const x = i % gridSize;
    const y = Math.floor(i / gridSize);
    cell.id = `cell-${x}-${y}`;

    cell.style.border = '1px solid darkgreen';
    cell.style.backgroundColor = 'lightgreen';
    grid.appendChild(cell);
  }

  return element.appendChild(grid);
}

export function setupGame(element: HTMLElement): GameContext {
  const GRID_SIZE = 16;
  const grid = setupGrid(element, GRID_SIZE);

  const snake = newSnake(3, GRID_SIZE)

  return {
    snake,
    grid,
    gridSize: GRID_SIZE
  }
}
