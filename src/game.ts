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

  const food = document.querySelector<HTMLDivElement>(`[data-x="${x}"][data-y="${y}"]`)!;
  food.dataset.food = 'true';
}

export function updateGrid(ctx: GameContext) {
  const { snake, grid } = ctx;

  const childrenPos = snake.getChildrenPositions();

  if (childrenPos.some(({ x, y }) => x === snake.x && y === snake.y)) {
    ctx.gameOver = true;
    return
  }

  (Array.from(grid.children) as HTMLDivElement[]).forEach((cell) => {
    delete cell.dataset.snake

    const cellX = Number(cell.dataset.x);
    const cellY = Number(cell.dataset.y);

    if (childrenPos.some(({ x, y }) => cellX === x && cellY === y)) {
      cell.dataset.snake = 'body';
    }

    if (cellX === snake.x && cellY === snake.y) {
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

  const intervalId = setInterval(() => {
    if (ctx.gameOver) {
      clearInterval(intervalId);

      alert('Game Over');
      location.reload();
      return;
    }

    ctx.snake.move();
    updateGrid(ctx);
  }, 150);
} 
