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

  const isGameOver = childrenPos.some(({ x, y }) => x === snake.x && y === snake.y)

  if (isGameOver) {
    ctx.gameOver = true;
    return
  }

  const datasetsToReset = ['snake', 'direction', 'fromDirection', 'toDirection'];

  (Array.from(grid.children) as HTMLDivElement[]).forEach((cell) => {
    datasetsToReset.forEach((dataset) => {
      delete cell.dataset[dataset];
    })

    const cellX = Number(cell.dataset.x);
    const cellY = Number(cell.dataset.y);

    const isSnakeHead = cellX === snake.x && cellY === snake.y;
    const snakeBodyIndex = childrenPos.findIndex(({ x, y }) => cellX === x && cellY === y)
    const isTail = snakeBodyIndex === childrenPos.length - 1

    if (snakeBodyIndex !== -1) {
      const snakeBody = childrenPos.at(snakeBodyIndex)!;
      const snakeBodyChild = childrenPos.at(snakeBodyIndex + 1);

      if (snakeBodyChild && snakeBodyChild.direction !== snakeBody.direction) {
        const fromDirectionMap: Record<SnakeDirection, SnakeDirection> = {
          left: 'right',
          right: 'left',
          up: 'down',
          down: 'up',
        }

        const fromDirection = fromDirectionMap[snakeBodyChild.direction];

        cell.dataset.fromDirection = fromDirection;
        cell.dataset.toDirection = snakeBody.direction;
      } else {
        cell.dataset.direction = snakeBody.direction;
      }
      cell.dataset.snake = 'body';
    }

    if (isTail) {
      cell.dataset.snake = 'tail';
    }

    if (isSnakeHead) {
      cell.dataset.snake = 'head';
      cell.dataset.direction = snake.direction;

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
