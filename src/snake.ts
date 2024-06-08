import { SnakeDirection } from "./types";

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

export class Snake extends SnakeChild {
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

  public move() {
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

  public getChildrenPositions() {
    const positions = [];
    let currentSnake: SnakeChild | null = this._child;

    while (currentSnake) {
      positions.push({ x: currentSnake.x, y: currentSnake.y });
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

