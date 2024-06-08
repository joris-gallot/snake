export type GameContext = {
  grid: HTMLElement;
  gridSize: number;
  snake: Snake;
}

export type SnakeDirection = 'up' | 'down' | 'left' | 'right';
