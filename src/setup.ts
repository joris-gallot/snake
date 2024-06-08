type GameContext = {
  grid: HTMLElement;
  gridSize: number;
  snake: Snake;
}

type SnakeDirection = 'up' | 'down' | 'left' | 'right';

const KEY_DIRECTION_MAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
} as const satisfies Record<string, SnakeDirection>

class SnakeChild {
  protected _x: number;
  protected _y: number;
  protected _child: SnakeChild | null;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
    this._child = null;
  }

  set child(child: SnakeChild) {
    this._child = child;
  }

  get x() {
    return this._x;
  }
  
  get y() {
    return this._y;
  }

  get child(): SnakeChild | null {
    return this._child;
  }

  move(x: number, y: number) {
    const currentPos = { x: this._x, y: this._y };

    this._x = x;
    this._y = y;

    if (this._child) {
      this._child.move(currentPos.x, currentPos.y);
    }
  }

}

class Snake extends SnakeChild {
  private _direction: SnakeDirection;
  private _limit: number;

  constructor(x: number, y: number, limit: number) {
    super(x, y);
    this._direction = 'down';
    this._limit = limit;
  }

  get direction() {
    return this._direction;
  }

  set direction(dir: SnakeDirection) {
    this._direction = dir;
  }

  move() {
    const currentPos = { x: this._x, y: this._y };

    switch (this._direction) {
      case 'up':
        this._y = this._y === 0 ? this._limit : this._y - 1;
        break;
      case 'down':
        this._y = this._y === this._limit ? 0 : this._y + 1;
        break;
      case 'left':
        this._x = this._x === 0 ? this._limit : this._x - 1;
        break;
      case 'right':
        this._x = this._x === this._limit ? 0 : this._x + 1;
        break;
    }

    if (this._child) {
      this._child.move(currentPos.x, currentPos.y);
    }
  }
}

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

function getAllPositions(snake: Snake) {
  const positions = [];
  let currentSnake = snake;

  while (currentSnake) {
    positions.push({ x: currentSnake.x, y: currentSnake.y });
    currentSnake = currentSnake.child;
  }

  return positions;
}

function updateGrid(ctx: GameContext)  {
  const { snake, grid } = ctx;

  const snakeWithChildrenPos = getAllPositions(snake);

  Array.from(grid.children).forEach((cell) => {
    cell.dataset.snake = 'false';

    if (snakeWithChildrenPos.some(({ x, y }) => cell.id === `cell-${x}-${y}`)) {
      cell.dataset.snake = 'true';
    }

    if (cell.id === `cell-${snake.x}-${snake.y}`) {
      cell.dataset.snake = 'head';
    }
  })
}

export function setupGame(element: HTMLElement): GameContext {
  const GRID_SIZE = 16;
  const grid = setupGrid(element, GRID_SIZE);

  const snake= new Snake(0, 2, GRID_SIZE);
  snake.child = new SnakeChild(snake.x, snake.y - 1);
  snake.child.child = new SnakeChild(snake.x, snake.child.y - 1);

  return {
    snake,
    grid,
    gridSize: GRID_SIZE
  } 
}

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

export function startGame(ctx: GameContext) {
  document.addEventListener('keydown', onKeydown(ctx))

  updateGrid(ctx);

  setInterval(() => {
    ctx.snake.move();
    updateGrid(ctx);
  }, 150);
} 
