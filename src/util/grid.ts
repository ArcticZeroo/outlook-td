import { ENEMY_START_TILE, GRID_TILE_SIDE_COUNT, TILE_SIZE_PX } from '../constants/grid.ts';
import { Axis } from '../models/axis.ts';
import { MapTileType } from '../models/map.ts';
import { Tower } from '../objects/tower.ts';
import { epsilonRound } from './math.ts';
import { Point } from './point.ts';

const GAP_LENGTH = 2;
const MAIN_PATH_LENGTH = 6;

// Make an S shape
const ENEMY_PATH_OFFSETS: ReadonlyArray<[Axis, number]> = [
    [Axis.horizontal, MAIN_PATH_LENGTH + 2], // 1 extra since we started offscreen, leave a gap of 1 at the end
    [Axis.vertical, -(GAP_LENGTH + 1)], // up with a gap of 2, then we'll go over
    [Axis.horizontal, -MAIN_PATH_LENGTH], // leave a gap of 1 near the side
    [Axis.vertical, -(GAP_LENGTH + 1)],
    [Axis.horizontal, MAIN_PATH_LENGTH + 2], // 1 extra to go offscreen
];

type MapTileValue = MapTileType | Tower;

class Grid {
    readonly #tiles: Map<number /*y*/, Map<number /*x*/, MapTileValue>> = new Map();
    readonly #pathDistancesByTile: Map<number /*y*/, Map<number /*x*/, number>> = new Map();
    readonly #pathPoints: Point[] = [];

    constructor() {
        this.#initializeGrid();
    }

    #setTile(point: Readonly<Point>, type: MapTileValue) {
        this.#tiles.get(point.y)?.set(point.x, type);
    }

    #initializePathPoint(point: Readonly<Point>, distance: number) {
        this.#setTile(point, MapTileType.path);
        this.#pathDistancesByTile.get(point.y)?.set(point.x, distance);
        this.#pathPoints.push(point.clone());
    }

    #initializeGrid() {
        for (let y = 0; y < GRID_TILE_SIDE_COUNT; y++) {
            const row = new Map();
            for (let x = 0; x < GRID_TILE_SIDE_COUNT; x++) {
                row.set(x, MapTileType.placeable);
            }
            this.#tiles.set(y, row);
            this.#pathDistancesByTile.set(y, new Map());
        }

        let lastPoint = ENEMY_START_TILE;
        this.#initializePathPoint(lastPoint, 0);
        let totalDistance = 0;

        for (const [direction, offset] of ENEMY_PATH_OFFSETS) {
            const sign = Math.sign(offset);
            const steps = Math.abs(offset);
            for (let i = 0; i < steps; i++) {
                totalDistance += 1;
                lastPoint = lastPoint.moveInDirection(direction, sign);
                this.#initializePathPoint(lastPoint, totalDistance);
            }
        }
    }

    get enemyPath(): ReadonlyArray<Point> {
        return this.#pathPoints;
    }

    getTile(point: Readonly<Point>) {
        return this.#tiles.get(point.y)?.get(point.x);
    }

    getPathDistance(point: Readonly<Point>) {
        return this.#pathDistancesByTile.get(point.y)?.get(point.x);
    }

    placeTower(point: Readonly<Point>, tower: Tower) {
        this.#setTile(point, tower);
    }

    isPlaceable(point: Readonly<Point>) {
        return this.getTile(point) === MapTileType.placeable;
    }

    removeTower(point: Readonly<Point>) {
        this.#setTile(point, MapTileType.placeable);
    }
}

export const GAME_MAP_GRID = new Grid();

export const positionPxToTile = (positionPx: Point): Point => {
    const tilePosition = positionPx.scale(1 / TILE_SIZE_PX);
    return new Point({
        x: Math.floor(epsilonRound(tilePosition.x, 0.001)),
        y: Math.floor(epsilonRound(tilePosition.y, 0.001))
    });
}

export function* generateTilesInRange(center: Point, range: number): Generator<Point> {
    const start = center.subtract({ x: range, y: range });
    const end = center.add({ x: range, y: range });

    for (let y = start.y; y <= end.y; y++) {
        for (let x = start.x; x <= end.x; x++) {
            yield new Point({ x, y });
        }
    }
}