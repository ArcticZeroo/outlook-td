import { TILE_ICON_SIZE_PX, TILE_SIZE_PX } from '../constants/grid.ts';
import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { EnemyContext } from '../context/enemies.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { lerpPosition } from '../util/lerp.ts';
import { Point } from '../util/point.ts';
import { LivingRenderObject } from './object.ts';

const APPLE_RADIUS_PX = TILE_ICON_SIZE_PX * 0.25;
const DISTANCE_THRESHOLD = APPLE_RADIUS_PX * 1.25;
const EXPLOSION_DURATION_MS = 150;

interface IAppleBulletConstructor {
    position: Point;
    targetPositionPx: Point;
    speed: number;
    splashRadiusTiles: number;
    damage: number;
}

export class AppleExplosive extends LivingRenderObject {
    readonly #targetPositionPx: Point;
    readonly #speed: number;
    readonly #splashRadiusTiles: number;
    readonly #damage: number;
    #isExploding = false;
    #explosionTimer = 0;
    #damagedEnemies = new Set<LivingRenderObject>();

    constructor({ position, speed, targetPositionPx, splashRadiusTiles, damage }: IAppleBulletConstructor) {
        super({ position });

        this.#damage = damage;
        this.#targetPositionPx = targetPositionPx;
        this.#speed = speed;
        this.#splashRadiusTiles = splashRadiusTiles;
    }

    #tickMovement() {
        const moveAmount = this.#speed * (RENDER_CONTEXT.deltaTimeMs / 1000);
        this._positionPx = lerpPosition(this._positionPx, this.#targetPositionPx, moveAmount * TILE_SIZE_PX);

        if (this._positionPx.distanceTo(this.#targetPositionPx) < DISTANCE_THRESHOLD) {
            this.#isExploding = true;
        }
    }

    #drawExplosion(explosionRadiusPx: number) {
        CANVAS_CONTEXT.beginPath();
        CANVAS_CONTEXT.arc(0, 0, explosionRadiusPx, 0, Math.PI * 2);
        CANVAS_CONTEXT.fillStyle = 'rgba(255, 0, 0, 0.75)';
        CANVAS_CONTEXT.fill();
        CANVAS_CONTEXT.closePath();
    }

    #tickExplosion() {
        if (this.#explosionTimer >= EXPLOSION_DURATION_MS) {
            this.destroy();
            return;
        }

        this.#explosionTimer += RENDER_CONTEXT.deltaTimeMs;
        const explosionPercentage = this.#explosionTimer / EXPLOSION_DURATION_MS;
        const explosionRadiusPx = explosionPercentage * this.#splashRadiusTiles * TILE_SIZE_PX;

        this.#drawExplosion(explosionRadiusPx);

        for (const enemy of EnemyContext.values) {
            if (!enemy.isHit(this._positionPx, explosionRadiusPx /*paddingPx*/) || this.#damagedEnemies.has(enemy)) {
                continue;
            }

            enemy.damage(this.#damage);
            this.#damagedEnemies.add(enemy);
        }
    }

    tick() {
        CANVAS_CONTEXT.save();
        CANVAS_CONTEXT.translate(this._positionPx.x, this._positionPx.y);
        CANVAS_CONTEXT.fillStyle = 'red';

        if (!this.#isExploding) {
            this.#tickMovement();
        } else {
            this.#tickExplosion();
        }

        CANVAS_CONTEXT.beginPath();
        CANVAS_CONTEXT.arc(0, 0, APPLE_RADIUS_PX, 0, Math.PI * 2);
        CANVAS_CONTEXT.fillStyle = 'red';
        CANVAS_CONTEXT.fill();
        CANVAS_CONTEXT.closePath();

        CANVAS_CONTEXT.restore();
    }
}