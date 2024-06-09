import { SnakeDirection } from "./types";

class SnakeChild {
  protected _x: number;
  protected _y: number;
  protected _child: SnakeChild | null;
  protected _direction: SnakeDirection;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
    this._child = null;
    this._direction = 'down';
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get direction() {
    return this._direction;
  }

  set direction(dir: SnakeDirection) {
    this._direction = dir;
  }

  set child(child: SnakeChild) {
    this._child = child;
  }

  get child(): SnakeChild | null {
    return this._child;
  }

  public move({ x, y, direction }: { x: number, y: number, direction: SnakeDirection }) {
    const currentPos = { x: this._x, y: this._y, direction: this._direction };

    this._x = x;
    this._y = y;
    this._direction = direction;

    if (this._child) {
      this._child.move(currentPos);
    }
  }

}

export class Snake extends SnakeChild {
  private _limit: number;

  constructor(x: number, y: number, limit: number) {
    super(x, y);
    this._limit = limit;
  }

  public grow() {
    let currentSnake: SnakeChild | null = this;

    while (currentSnake.child) {
      currentSnake = currentSnake.child;
    }

    const child = new SnakeChild(currentSnake.x, currentSnake.y);
    currentSnake.child = child;
  }

  public isAt(x: number, y: number) {
    if (this._x === x && this._y === y) {
      return true;
    }

    const positions = this.getChildrenPositions();

    return positions.some(({ x: posX, y: posY }) => posX === x && posY === y);
  }

  public move() {
    const currentPos = { x: this._x, y: this._y, direction: this._direction };

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
      this._child.move(currentPos);
    }
  }

  public getChildrenPositions() {
    const positions: Array<{ x: number, y: number, direction: SnakeDirection }> = [];
    let currentSnake: SnakeChild | null = this._child;

    while (currentSnake) {
      positions.push({ x: currentSnake.x, y: currentSnake.y, direction: currentSnake.direction });
      currentSnake = currentSnake.child;
    }

    return positions;
  }
}

export function newSnake({ size, limit }: { size: number, limit: number }) {
  let snake = new Snake(0, size - 1, limit);
  let currentSnake: SnakeChild = snake;

  for (let i = 0; i < size - 1; i++) {
    const child = new SnakeChild(currentSnake.x, currentSnake.y - 1);
    currentSnake.child = child;
    currentSnake = child;
  }

  return snake;
}

