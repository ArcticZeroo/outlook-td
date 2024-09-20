import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { MouseTileHoverContext } from '../context/mouse.ts';
import { MapTileType } from '../models/map.ts';
import { Box } from '../util/box.ts';
import { GRID_TILE_SIDE_COUNT, TILE_SIZE_PX } from '../constants/grid.ts';
import { GAME_MAP_GRID } from '../util/grid.ts';
import { Point } from '../util/point.ts';
import { GameStateContext } from '../context/game-state.ts';
import { GameState } from '../models/game.ts';

class GridObject {
    #mousePosition: Point = new Point({ x: 0, y: 0 });

    constructor() {
        document.addEventListener('mousemove', (event) => {
            this.#mousePosition = new Point({ x: event.clientX, y: event.clientY });
        });
    }

    tick() {
        const canvasRect = CANVAS_CONTEXT.canvas.getBoundingClientRect();
        CANVAS_CONTEXT.strokeStyle = '#000';

        let mouseTile = null;
        for (let x = 0; x < GRID_TILE_SIDE_COUNT; x++) {
            for (let y = 0; y < GRID_TILE_SIDE_COUNT; y++) {
                const xStart = x * TILE_SIZE_PX;
                const yStart = y * TILE_SIZE_PX;

                const tileType = GAME_MAP_GRID.getTile(new Point({ x, y }));

                if (tileType === MapTileType.path) {
                    CANVAS_CONTEXT.fillStyle = '#00b2ff';
                    CANVAS_CONTEXT.fillRect(xStart, yStart, TILE_SIZE_PX, TILE_SIZE_PX);
                } else if (GameStateContext.value === GameState.playing) {
                    const tileBox = new Box({
                        x: xStart + canvasRect.left,
                        y: yStart + canvasRect.top,
                        width: TILE_SIZE_PX,
                        height: TILE_SIZE_PX
                    });

                    if (tileBox.isPointInside(this.#mousePosition)) {
                        CANVAS_CONTEXT.fillStyle = '#3a9d6c';
                        CANVAS_CONTEXT.fillRect(xStart, yStart, TILE_SIZE_PX, TILE_SIZE_PX);
                        mouseTile = new Point({ x, y });
                    }
                }
                CANVAS_CONTEXT.strokeRect(xStart, yStart, TILE_SIZE_PX, TILE_SIZE_PX);
            }
        }

        MouseTileHoverContext.value = mouseTile;
    }
}

export const GRID_RENDER_OBJECT = new GridObject();