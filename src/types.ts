import type { Snake } from './snake';

export type GameContext = {
  grid: HTMLElement;
  gridSize: number;
  snake: Snake;
  gameOver: boolean;
}

export type SnakeDirection = 'up' | 'down' | 'left' | 'right';
