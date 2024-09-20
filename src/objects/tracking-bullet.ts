import { TILE_SIZE_PX } from '../constants/grid.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { lerpPosition } from '../util/lerp.ts';
import { Point } from '../util/point.ts';
import { LivingRenderObject } from './object.ts';

const DISTANCE_THRESHOLD_PX = TILE_SIZE_PX * 0.25;

export interface ITrackingBulletConstructor {
    speed: number;
    maxDistanceTiles?: number;
    target: LivingRenderObject;
    position: Point;
    onHit(): void;
}

export abstract class TrackingBullet extends LivingRenderObject {
    readonly #speed: number;
    readonly #maxDistanceTiles: number;
    readonly #target: LivingRenderObject;
    readonly #onHit: () => void;
    #distanceMovedTiles: number = 0;

    constructor({ onHit, speed, maxDistanceTiles = Number.POSITIVE_INFINITY, target, position }: ITrackingBulletConstructor) {
        super({ position });

        this.#speed = speed;
        this.#maxDistanceTiles = maxDistanceTiles;
        this.#target = target;
        this.#onHit = onHit;
    }

    protected getTargetPosition(): Point {
        return this.#target.positionPx;
    }

    tick() {
        if (RENDER_CONTEXT.deltaTimeMs === 0) {
            return;
        }

        if (!this.#target.isAlive) {
            this.destroy();
            return;
        }

        const distanceMovedTiles = this.#speed * (RENDER_CONTEXT.deltaTimeMs / 1000);
        const distanceMovedPx = distanceMovedTiles * TILE_SIZE_PX;

        const targetPosition = this.getTargetPosition();
        this._positionPx = lerpPosition(this.positionPx, targetPosition, distanceMovedPx);

        const distanceToTargetPx = this._positionPx.distanceTo(targetPosition);
        if (distanceToTargetPx < DISTANCE_THRESHOLD_PX) {
            this.#onHit();
            this.destroy();
            return;
        }

        this.#distanceMovedTiles += distanceMovedTiles;
        if (this.#distanceMovedTiles >= this.#maxDistanceTiles) {
            this.destroy();
        }
    }
}