import HookSvg from '../assets/hook.svg';
import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { TILE_ICON_SIZE_PX, TILE_SIZE_PX } from '../constants/grid.ts';
import { lerpPosition } from '../util/lerp.ts';
import { Point } from '../util/point.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { Icon } from './icon.ts';
import { LivingRenderObject } from './object.ts';

// can be pretty high
const DISTANCE_THRESHOLD_PX = TILE_SIZE_PX;
const FISHING_HOOK_ICON = new Icon({
    width: TILE_ICON_SIZE_PX / 2,
    height: TILE_ICON_SIZE_PX / 2,
    path: HookSvg
});

const ROD_POSITION_OFFSET = TILE_ICON_SIZE_PX / 2;
const TIME_AFTER_DRAG_MS = 500;

interface IFishingHookConstructor {
    position: Point;
    target: EnemyPathMover;
    speed: number;
    damage: number;
    onComplete: () => void;
}

export class FishingHook extends LivingRenderObject {
    readonly #damage: number;
    readonly #target: EnemyPathMover;
    readonly #speed: number;
    readonly #rodPosition: Point;
    readonly #onComplete: () => void;
    #hasReachedTarget = false;
    #destroyTimer = TIME_AFTER_DRAG_MS;
    #hasFinishedDragging = false;

    constructor({ position, target, speed, damage, onComplete }: IFishingHookConstructor) {
        super({ position });
        this.#target = target;
        this.#speed = speed;
        this.#damage = damage;
        this.#rodPosition = position.subtract({
            x: ROD_POSITION_OFFSET,
            y: ROD_POSITION_OFFSET
        });
        this.#onComplete = onComplete;
    }

    #tickDestroyTimer() {
        this.#destroyTimer -= RENDER_CONTEXT.deltaTimeMs;
        if (this.#destroyTimer <= 0) {
            this.destroy();
            this.#onComplete();
        }
    }

    tick() {
        if (!this.#target.isAlive || this.#hasFinishedDragging) {
            this.#tickDestroyTimer();
        }

        CANVAS_CONTEXT.strokeStyle = '#EEE';
        CANVAS_CONTEXT.beginPath();
        CANVAS_CONTEXT.moveTo(this.#rodPosition.x, this.#rodPosition.y);
        CANVAS_CONTEXT.lineTo(this._positionPx.x + (FISHING_HOOK_ICON.width / 2), this._positionPx.y);
        CANVAS_CONTEXT.stroke();

        FISHING_HOOK_ICON.render(this._positionPx);

        if (this.#hasReachedTarget) {
            this._positionPx = this.#target.positionPx.clone().add({
                x: TILE_ICON_SIZE_PX / 2,
            });
            return;
        }

        if (!this.#hasFinishedDragging) {
            const distanceMovedTiles = this.#speed * (RENDER_CONTEXT.deltaTimeMs / 1000);
            const distanceMovedPx = distanceMovedTiles * TILE_SIZE_PX;
            this._positionPx = lerpPosition(this._positionPx, this.#target.positionPx, distanceMovedPx);

            const distanceToTargetPx = this._positionPx.distanceTo(this.#target.positionPx);
            if (distanceToTargetPx < DISTANCE_THRESHOLD_PX) {
                this.#hasReachedTarget = true;
                this.#target.damage(this.#damage);
                this.#target.dragBackwards(() => {
                    this.#hasFinishedDragging = true;
                });
            }
        }
    }
}