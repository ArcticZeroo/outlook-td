import { Views } from '../ui/views.ts';
import { Point } from '../util/point.ts';

export const CANVAS_SIZE_PX = 800;
Views.gameCanvas.width = CANVAS_SIZE_PX;
Views.gameCanvas.height = CANVAS_SIZE_PX;

export const GRID_TILE_SIDE_COUNT = 9;
const LAST_GRID_INDEX = GRID_TILE_SIDE_COUNT - 1;

export const TILE_SIZE_PX = CANVAS_SIZE_PX / GRID_TILE_SIDE_COUNT;
export const TILE_ICON_SIZE_PX = TILE_SIZE_PX * 0.8;
export const TILE_ICON_OFFSET_PX = (TILE_SIZE_PX - TILE_ICON_SIZE_PX) / 2;

export const ENEMY_START_TILE = new Point({ x: -1, y: LAST_GRID_INDEX - 1 });
