import type { Snake } from './snake';

export type GameContext = {
  grid: HTMLElement;
  gridSize: number;
  snake: Snake;
  started: boolean;
}

export type SnakeDirection = 'up' | 'down' | 'left' | 'right';
