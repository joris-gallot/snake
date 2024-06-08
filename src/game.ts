import type { GameContext } from './types';

const KEY_DIRECTION_MAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
} as const satisfies Record<string, SnakeDirection>

function onKeydown(ctx: GameContext) {
  return (e: KeyboardEvent) => {
    const key = KEY_DIRECTION_MAP[e.key];

    if (!key) return;
    if (ctx.snake.direction === 'down' && key === 'up') return;
    if (ctx.snake.direction === 'up' && key === 'down') return;
    if (ctx.snake.direction === 'right' && key === 'left') return;
    if (ctx.snake.direction === 'left' && key === 'right') return;

    ctx.snake.direction = key;
  }
}

function updateGrid(ctx: GameContext) {
  const { snake, grid } = ctx;

  const childrenPos = snake.getChildrenPositions();

  Array.from(grid.children).forEach((cell) => {
    cell.dataset.snake = 'false';

    if (childrenPos.some(({ x, y }) => cell.id === `cell-${x}-${y}`)) {
      cell.dataset.snake = 'true';
    }

    if (cell.id === `cell-${snake.x}-${snake.y}`) {
      cell.dataset.snake = 'head';
    }
  })
}

export function startGame(ctx: GameContext) {
  document.addEventListener('keydown', onKeydown(ctx))

  updateGrid(ctx);

  setInterval(() => {
    ctx.snake.move();
    updateGrid(ctx);
  }, 150);
} 
