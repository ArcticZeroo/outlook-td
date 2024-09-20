import { TILE_ICON_OFFSET_PX, TILE_ICON_SIZE_PX, TILE_SIZE_PX } from '../constants/grid.ts';
import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { EnemyContext } from '../context/enemies.ts';
import { MousePositionContext } from '../context/mouse.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { Box } from '../util/box.ts';
import { GAME_MAP_GRID, generateTilesInRange } from '../util/grid.ts';
import { Point } from '../util/point.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { Icon } from './icon.ts';
import { renderInfectionEffect } from './infection.ts';
import { LivingRenderObject } from './object.ts';

const INFECTION_TIME_MS = 15_000;
const INFECTION_IMMUNITY_MS = 15_000;
const INFECTION_FIRE_RATE_DEBUFF = 2;
const INFECTION_DAMAGE_DEBUFF = 0.5;

export interface ITowerConstructor {
    cost: number;
    tile: Point;
    damage: number;
    range: number;
    secondsPerBullet: number;
    iconPath: string;
}

export abstract class Tower extends LivingRenderObject {
    readonly #cost: number;
    readonly #tile: Point;
    readonly #damage: number;
    readonly #range: number;
    readonly #msPerBullet: number;
    readonly #icon: Icon;
    readonly #iconPosition: Point;
    #lastFireTime: number = 0;
    #infectionTimer: number = 0;
    #infectionImmunityTimer: number = 0;

    protected constructor({ cost, tile, damage, range, secondsPerBullet, iconPath }: ITowerConstructor) {
        super({
            position: tile.scale(TILE_SIZE_PX)
        });
        this.#cost = cost;
        this.#tile = tile;
        this.#damage = damage;
        this.#range = range + 0.5; // Add 0.5 to account for center of the tile
        this.#msPerBullet = secondsPerBullet * 1000;
        this.#icon = new Icon({
            path:   iconPath,
            height: TILE_ICON_SIZE_PX,
            width:  TILE_ICON_SIZE_PX
        });
        this.#iconPosition = this.#tile.scale(TILE_SIZE_PX).add({ x: TILE_ICON_OFFSET_PX, y: TILE_ICON_OFFSET_PX });
    }

    get sellValue() {
        return Math.floor(this.#cost / 2);
    }

    get range() {
        return this.#range;
    }

    get damage() {
        return this.#damage;
    }

    get fireRate() {
        return this.#msPerBullet;
    }

    get effectiveTimeBetweenBulletsMs() {
        if (this.#infectionTimer > 0) {
            return this.#msPerBullet * INFECTION_FIRE_RATE_DEBUFF;
        }

        return this.#msPerBullet;
    }

    get #canFire() {
        return (RENDER_CONTEXT.timeNow - this.#lastFireTime) > this.effectiveTimeBetweenBulletsMs;
    }

    get canBeInfected() {
        return this.#infectionTimer <= Number.EPSILON && this.#infectionImmunityTimer <= Number.EPSILON;
    }

    #tickInfection() {
        if (this.#infectionTimer > 0) {
            this.#infectionTimer -= RENDER_CONTEXT.deltaTimeMs;
        } else if (this.#infectionImmunityTimer > 0) {
            this.#infectionImmunityTimer -= RENDER_CONTEXT.deltaTimeMs;
        }
    }

    #fire(enemy: EnemyPathMover) {
        this.#lastFireTime = RENDER_CONTEXT.timeNow;
        this.spawnBullet(enemy, this.effectiveDamage);
    }

    getTileBounds(): Box {
        const rect = CANVAS_CONTEXT.canvas.getBoundingClientRect();
        return new Box({
            x: this._positionPx.x + rect.x,
            y: this._positionPx.y + rect.y,
            width: TILE_SIZE_PX,
            height: TILE_SIZE_PX
        });
    }

    destroy() {
        super.destroy();
    }

    infect() {
        if (this.#infectionImmunityTimer > 0) {
            return;
        }

        this.#infectionTimer = INFECTION_TIME_MS;
        this.#infectionImmunityTimer = INFECTION_IMMUNITY_MS;
    }

    abstract spawnBullet(target: EnemyPathMover, damage: number): void;

    protected canAttackEnemy(_enemy: EnemyPathMover) {
        return true;
    }

    protected isReadyToFire() {
        return true;
    }

    protected renderIcon(icon: Icon, iconPosition: Point) {
        icon.render(iconPosition);
    }

    get effectiveDamage() {
        if (this.#infectionTimer > 0) {
            return Math.floor(this.#damage * INFECTION_DAMAGE_DEBUFF);
        }

        return this.#damage;
    }

    tick() {
        this.#tickInfection();

        const center = this.tileCenterPx;
        const isMouseOnTile = this.getTileBounds().isPointInside(MousePositionContext.value);
        if (isMouseOnTile) {
            // Draw range indicator
            CANVAS_CONTEXT.fillStyle = 'rgba(255, 0, 0, 0.2)';
            CANVAS_CONTEXT.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            CANVAS_CONTEXT.beginPath();
            CANVAS_CONTEXT.arc(center.x, center.y, this.#range * TILE_SIZE_PX, 0, 2 * Math.PI);
            CANVAS_CONTEXT.closePath();
            CANVAS_CONTEXT.fill();
            CANVAS_CONTEXT.stroke();
        }

        this.renderIcon(this.#icon, this.#iconPosition);

        if (this.#infectionTimer > 0) {
            this.#infectionTimer -= RENDER_CONTEXT.deltaTimeMs;
            renderInfectionEffect(this.tileCenterPx, this.createTime);
        }

        if (this.#canFire && this.isReadyToFire()) {
            let furthestTravelEnemy: EnemyPathMover | null = null;
            let furthestTravelDistance = 0;
            for (const enemy of EnemyContext.values) {
                if (!this.canAttackEnemy(enemy)) {
                    continue;
                }

                const enemyTile = enemy.tile;
                // intentional that this isn't manhattan distance
                const distanceInTiles = Math.floor(this.#tile.distanceTo(enemyTile));
                if (distanceInTiles <= this.#range) {
                    const distance = enemy.distanceTraveled;
                    if (distance > furthestTravelDistance) {
                        furthestTravelDistance = distance;
                        furthestTravelEnemy = enemy;
                    }
                }
            }

            if (furthestTravelEnemy != null) {
                this.#fire(furthestTravelEnemy);
            }
        }
    }

    static *generateTowersInRange(center: Point, range: number): Generator<Tower> {
        for (const point of generateTilesInRange(center, range)) {
            const tile = GAME_MAP_GRID.getTile(point);
            if (tile instanceof Tower) {
                yield tile;
            }
        }
    }
}