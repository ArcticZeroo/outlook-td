import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { TILE_ICON_OFFSET_PX, TILE_ICON_SIZE_PX } from '../constants/grid.ts';
import { Point } from '../util/point.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { LivingRenderObject } from './object.ts';

const TIME_BETWEEN_JUMPS_MS = 50;
const MAX_DISTANCE_BETWEEN_TARGETS_TILES = 2.5;
const PERSISTENCE_AFTER_JUMPS_TIME_MS = 500;

interface ILightningConstructor {
    position: Point;
    target: EnemyPathMover;
    damage: number;
    maxTargetCount: number;
}

export class Lightning extends LivingRenderObject {
    readonly #damage: number;
    readonly #jumpRoot: EnemyPathMover;
    readonly #jumpTree = new Map<EnemyPathMover, EnemyPathMover>();
    readonly #attackedEnemies = new Set<EnemyPathMover>();
    #currentTarget: EnemyPathMover;
    #targetCount: number;
    #timer = 0;

    constructor({ position, target, damage, maxTargetCount }: ILightningConstructor) {
        super({ position });

        this.#jumpRoot = target;
        this.#currentTarget = target;
        this.#damage = damage;
        this.#targetCount = maxTargetCount;
    }

    #findNextTarget() {
        let furthestDistance = 0;
        let furthestEnemy: EnemyPathMover | null = null;

        for (const enemy of this.#attackedEnemies) {
            const possibleJumpEnemies = EnemyPathMover.getEnemiesInTileRange(enemy.tile, MAX_DISTANCE_BETWEEN_TARGETS_TILES);
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

    tick() {
        this.#pokeJumpTick();

        CANVAS_CONTEXT.shadowColor = 'blue';
        CANVAS_CONTEXT.shadowBlur = 10;
        CANVAS_CONTEXT.strokeStyle = 'blue';
        CANVAS_CONTEXT.beginPath();
        CANVAS_CONTEXT.moveTo(this._positionPx.x, this._positionPx.y);

        // todo: look cooler by doing little squiggles along the path
        let currentNode: EnemyPathMover | undefined = this.#jumpRoot;
        while (currentNode != null) {
            const position = currentNode.positionPx.add({
                x: (TILE_ICON_SIZE_PX / 2) + TILE_ICON_OFFSET_PX,
                y: TILE_ICON_SIZE_PX / 2
            });
            CANVAS_CONTEXT.lineTo(position.x, position.y);
            currentNode = this.#jumpTree.get(currentNode);
        }

        CANVAS_CONTEXT.stroke();
        CANVAS_CONTEXT.closePath();
        CANVAS_CONTEXT.shadowColor = 'rgba(0, 0, 0, 0)';
    }
}