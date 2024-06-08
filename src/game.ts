import type { GameContext, SnakeDirection } from './types';

const KEY_DIRECTION_MAP: Record<string, SnakeDirection> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

function onKeydown(ctx: GameContext) {
  const { snake } = ctx;

  return (e: KeyboardEvent) => {
    const key = KEY_DIRECTION_MAP[e.key];

    if (!key) return;
    if (snake.direction === 'down' && key === 'up') return;
    if (snake.direction === 'up' && key === 'down') return;
    if (snake.direction === 'right' && key === 'left') return;
    if (snake.direction === 'left' && key === 'right') return;

    snake.direction = key;
  }
}

export function generateFood(ctx: GameContext) {
  const { gridSize, snake } = ctx;

  let x: number;
  let y: number;

  do {
    x = Math.floor(Math.random() * gridSize);
    y = Math.floor(Math.random() * gridSize);
  } while (snake.isAt(x, y));

  const food = document.getElementById(`cell-${x}-${y}`)!;
  food.dataset.food = 'true';
}

export function updateGrid(ctx: GameContext) {
  const { snake, grid } = ctx;

  const childrenPos = snake.getChildrenPositions();

  (Array.from(grid.children) as HTMLDivElement[]).forEach((cell) => {
    delete cell.dataset.snake

    if (childrenPos.some(({ x, y }) => cell.id === `cell-${x}-${y}`)) {
      cell.dataset.snake = 'true';
    }

    if (cell.id === `cell-${snake.x}-${snake.y}`) {
      cell.dataset.snake = 'head';

      if (cell.dataset.food === 'true') {
        delete cell.dataset.food
        snake.grow();
        generateFood(ctx);
      }
    }
  })
}

export function startGame(ctx: GameContext) {
  document.addEventListener('keydown', onKeydown(ctx))

  setInterval(() => {
    ctx.snake.move();
    updateGrid(ctx);
  }, 150);
} 
