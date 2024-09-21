import { TILE_ICON_SIZE_PX } from '../constants/grid.ts';
import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { Point } from '../util/point.ts';
import { between } from '../util/random.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { LivingRenderObject } from './object.ts';

const TIME_BETWEEN_JUMPS_MS = 50;
const PERSISTENCE_AFTER_JUMPS_TIME_MS = 500;

const MIN_DISTANCE_BETWEEN_JIGGLE_PX = TILE_ICON_SIZE_PX * 0.2;
const MAX_DISTANCE_BETWEEN_JIGGLE_PX = TILE_ICON_SIZE_PX * 0.35;

const LIGHTNING_MOVEMENT_MS = 500;

interface ILightningConstructor {
    position: Point;
    target: EnemyPathMover;
    damage: number;
    maxTargetCount: number;
    maxDistanceBetweenTargetsPx: number;
}

export class Lightning extends LivingRenderObject {
    readonly #damage: number;
    readonly #jumpRoot: EnemyPathMover;
    readonly #jumpTree = new Map<EnemyPathMover, EnemyPathMover>();
    readonly #attackedEnemies = new Set<EnemyPathMover>();
    readonly #maxDistanceBetweenTargetsPx: number;
    #currentTarget: EnemyPathMover;
    #targetCount: number;
    #timer = 0;

    constructor({ position, target, damage, maxTargetCount, maxDistanceBetweenTargetsPx }: ILightningConstructor) {
        super({ position });

        this.#jumpRoot = target;
        this.#currentTarget = target;
        this.#damage = damage;
        this.#targetCount = maxTargetCount;
        this.#maxDistanceBetweenTargetsPx = maxDistanceBetweenTargetsPx;
    }

    #findNextTarget() {
        let furthestDistance = 0;
        let furthestEnemy: EnemyPathMover | null = null;

        for (const enemy of this.#attackedEnemies) {
            const possibleJumpEnemies = EnemyPathMover.getEnemiesInPxRange(enemy.tileCenterPx, this.#maxDistanceBetweenTargetsPx + enemy.iconPaddingRadiusPx);
            for (const possibleJumpEnemy of possibleJumpEnemies) {
                if (!this.#attackedEnemies.has(possibleJumpEnemy)) {
                    const distance = possibleJumpEnemy.distanceTraveled;
                    if (distance > furthestDistance) {
                        furthestDistance = distance;
                        furthestEnemy = possibleJumpEnemy;
                    }
                }
            }
        }

        return furthestEnemy;
    }

    #pokeJumpTick() {
        if (this.#timer > 0) {
            this.#timer -= RENDER_CONTEXT.deltaTimeMs;
            return;
        }

        if (this.#targetCount === 0) {
            this.destroy();
            return;
        }

        if (this.#currentTarget.isAlive) {
            this.#attackedEnemies.add(this.#currentTarget);
            this.#currentTarget.damage(this.#damage);
            this.#targetCount--;
        }

        if (this.#targetCount > 0) {
            this.#timer = TIME_BETWEEN_JUMPS_MS;
            const newTarget = this.#findNextTarget();
            if (newTarget) {
                this.#jumpTree.set(this.#currentTarget, newTarget);
                this.#currentTarget = newTarget;
                return;
            }
        }

        // All out of targets or we can't find any more
        this.#targetCount = 0;
        this.#timer = PERSISTENCE_AFTER_JUMPS_TIME_MS;
    }

    #drawLineBetweenTargets(start: Point, end: Point) {
        let currentPoint = start;

        console.log('drawing line between', start, end);

        while (!currentPoint.equals(end)) {
            const direction = start.unitVectorTo(end);
            const distance = currentPoint.distanceTo(end);

            if (distance < (MAX_DISTANCE_BETWEEN_JIGGLE_PX * 2)) {
                currentPoint = end;
            } else {
                const jiggleDistance = between(MIN_DISTANCE_BETWEEN_JIGGLE_PX, MAX_DISTANCE_BETWEEN_JIGGLE_PX);

                // find the max angle that we can travel without moving further away than the current distance
                // (solved on paper)
                const maxAngle = Math.acos(jiggleDistance / (2 * distance));

                const angle = between(-maxAngle, maxAngle);
                currentPoint = currentPoint.add(direction.rotate(angle).scale(jiggleDistance));

                console.log(jiggleDistance, maxAngle, angle, currentPoint);
            }

            CANVAS_CONTEXT.lineTo(currentPoint.x, currentPoint.y);
            CANVAS_CONTEXT.moveTo(currentPoint.x, currentPoint.y);
        }
    }

    tick() {
        this.#pokeJumpTick();

        CANVAS_CONTEXT.save();
        CANVAS_CONTEXT.shadowColor = 'blue';
        CANVAS_CONTEXT.shadowBlur = 10;
        CANVAS_CONTEXT.strokeStyle = 'lightblue';
        CANVAS_CONTEXT.lineWidth = 4;
        CANVAS_CONTEXT.beginPath();
        CANVAS_CONTEXT.moveTo(this._positionPx.x, this._positionPx.y);

        let currentPosition = this.positionPx;
        let currentTarget: EnemyPathMover | undefined = this.#jumpRoot;
        while (currentTarget != null) {
            const targetPosition = currentTarget.iconCenterPx;
            this.#drawLineBetweenTargets(currentPosition, targetPosition);

            currentTarget = this.#jumpTree.get(currentTarget);
            currentPosition = targetPosition;
        }

        CANVAS_CONTEXT.stroke();
        CANVAS_CONTEXT.closePath();
        CANVAS_CONTEXT.shadowColor = 'rgba(0, 0, 0, 0)';
        CANVAS_CONTEXT.restore();
    }
}