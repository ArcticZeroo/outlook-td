import SpearSvg from '../assets/spear.svg';
import { TILE_ICON_SIZE_PX, TILE_SIZE_PX } from '../constants/grid.ts';
import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { EnemyContext } from '../context/enemies.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { Point } from '../util/point.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { Icon } from './icon.ts';
import { LivingRenderObject } from './object.ts';

const DISTANCE_THRESHOLD_PX = 0.75 * TILE_SIZE_PX;
const SPEAR_ICON = new Icon({
    path: SpearSvg,
    height: TILE_ICON_SIZE_PX * 0.8,
    width: TILE_ICON_SIZE_PX * 0.8
});
const ROTATION_OFFSET_RAD = -Math.PI / 2;

interface ISpearConstructor {
    position: Point;
    damage: number;
    speed: number;
    maxDistanceTiles: number;
    pierce: number;
    target: EnemyPathMover;
}

export class Spear extends LivingRenderObject {
    readonly #damage: number;
    readonly #speed: number;
    readonly #targetDirection: Point;
    readonly #targetAngleRad: number = 0;
    readonly #damagedEnemies = new Set<EnemyPathMover>();
    #pierce: number;
    #distanceLeftToTravel: number;

    constructor({ position, damage, speed, maxDistanceTiles, pierce, target }: ISpearConstructor) {
        super({ position });

        this.#damage = damage;
        this.#speed = speed;
        this.#distanceLeftToTravel = maxDistanceTiles;
        this.#pierce = pierce;
        this.#targetDirection = target.tile.subtract(this.tile).normalize();
        this.#targetAngleRad = Math.atan2(this.#targetDirection.y, this.#targetDirection.x) - ROTATION_OFFSET_RAD;
    }

    tick() {
        if (RENDER_CONTEXT.deltaTimeMs === 0) {
            return;
        }

        const distanceMovedTiles = this.#speed * (RENDER_CONTEXT.deltaTimeMs / 1000);
        const distanceMovedPx = distanceMovedTiles * TILE_SIZE_PX;

        this._positionPx = this._positionPx.add(this.#targetDirection.scale(distanceMovedPx));

        for (const enemy of EnemyContext.values) {
            if (this.#damagedEnemies.has(enemy)) {
                continue;
            }

            if (enemy.positionPx.distanceTo(this._positionPx) <= DISTANCE_THRESHOLD_PX) {
                this.#damagedEnemies.add(enemy);
                enemy.damage(this.#damage);
                this.#pierce--;
                if (this.#pierce <= 0) {
                    this.destroy();
                }
            }
        }

        this.#distanceLeftToTravel -= distanceMovedTiles;
        if (this.#distanceLeftToTravel <= 0) {
            this.destroy();
        }

        CANVAS_CONTEXT.translate(this._positionPx.x, this._positionPx.y);
        CANVAS_CONTEXT.rotate(this.#targetAngleRad);
        SPEAR_ICON.render(Point.zero);
        CANVAS_CONTEXT.rotate(-this.#targetAngleRad);
        CANVAS_CONTEXT.translate(-this._positionPx.x, -this._positionPx.y);
    }
}