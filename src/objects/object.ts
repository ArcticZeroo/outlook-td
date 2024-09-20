import { TILE_SIZE_PX } from '../constants/grid.ts';
import { addRenderObject, removeRenderObject } from '../context/objects.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { positionPxToTile } from '../util/grid.ts';
import { Point } from '../util/point.ts';

export interface IRenderObjectConstructor {
    position?: Point;
}

export abstract class LivingRenderObject {
    protected _positionPx: Point;
    readonly #createTime: number = 0;
    #isAlive: boolean = false;

    constructor({ position = Point.zero }: IRenderObjectConstructor = {}) {
        this._positionPx = position;
        addRenderObject(this);
        this.#createTime = Date.now();
        this.#isAlive = true;
    }

    get tile() {
        return positionPxToTile(this._positionPx);
    }

    get tileCenterPx(): Point {
        return this.tile.scale(TILE_SIZE_PX).add({ x: TILE_SIZE_PX / 2, y: TILE_SIZE_PX / 2 });
    }

    get positionPx(): Point {
        return this._positionPx;
    }

    get isAlive() {
        return this.#isAlive;
    }

    get createTime() {
        return this.#createTime;
    }

    get timeSinceCreate() {
        return RENDER_CONTEXT.timeNow - this.#createTime;
    }

    destroy(): void {
        removeRenderObject(this);
        this.#isAlive = false;
    }

    abstract tick(): void;
}