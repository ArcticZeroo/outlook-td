import { ENEMY_START_TILE, TILE_ICON_OFFSET_PX, TILE_ICON_SIZE_PX, TILE_SIZE_PX } from '../constants/grid.ts';
import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { PlayerCurrencyContext } from '../context/currency.ts';
import { EnemyContext } from '../context/enemies.ts';
import { PlayerLivesContext } from '../context/lives.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { GAME_MAP_GRID } from '../util/grid.ts';
import { lerpPosition } from '../util/lerp.ts';
import { Point } from '../util/point.ts';
import { FloatingIcon } from './floating-icon.ts';
import { LivingRenderObject } from './object.ts';
import { CurrentWaveContext } from '../context/wave.ts';

const HEALTH_BAR_Y_OFFSET_PX = 10;
const HEALTH_BAR_WIDTH_PX = TILE_ICON_SIZE_PX * 0.9;
const HEALTH_BAR_HEIGHT_PX = 10;
const HEALTH_BAR_X_OFFSET_PX = (TILE_SIZE_PX - HEALTH_BAR_WIDTH_PX) / 2;
const DRAG_DISTANCE_THRESHOLD_PX = TILE_SIZE_PX * 0.25;

const DRAG_SPEED = 1;
const BACKWARDS_DRAG_TILE_COUNT = 3;

const HIT_PADDING_PX = TILE_ICON_SIZE_PX * 0.05;

const STAT_INCREASE_PER_WAVE = 0.05;

export interface IEnemyPathMoverConstructor {
    moveSpeed: number;
    lives: number;
    health: number;
    iconPath: string;
    currencyValue: number;
    initialTileIndex?: number;
}

export class EnemyPathMover extends LivingRenderObject {
    readonly #moveSpeed: number;
    readonly #lives: number;
    readonly #icon: FloatingIcon;
    readonly #floatOffset: number;
    readonly #initialHealth: number;
    readonly #currencyValue: number;
    readonly #iconPath: string;
    #isMovingLeft = false;
    #health: number;
    #targetTileIndex: number = 0;
    #distanceTraveledInTiles: number = 0;
    #isBeingDraggedToStart: boolean = false;
    #onBeingDraggedComplete: ((cancelled: boolean) => void) | null = null;

    constructor({ moveSpeed, lives, health, currencyValue, iconPath, initialTileIndex = 0 }: IEnemyPathMoverConstructor) {
        super({
            position: ENEMY_START_TILE.subtract({ x: 1 }).scale(TILE_SIZE_PX)
        });

        const statMultiplier = 1 + (STAT_INCREASE_PER_WAVE * CurrentWaveContext.value);
        // move speed can be fractional
        moveSpeed = moveSpeed * statMultiplier;
        health = Math.round(health * statMultiplier);

        this.#moveSpeed = moveSpeed;
        this.#lives = lives;
        this.#initialHealth = health;
        this.#health = health;
        this.#currencyValue = currencyValue;
        this.#iconPath = iconPath;
        this.#targetTileIndex = initialTileIndex;

        this.#updateTargetPoint(this.#targetTileIndex);

        if (this.#targetTileIndex !== 0) {
            this._positionPx = this.#targetTile.scale(TILE_SIZE_PX);
        }

        this.#icon = new FloatingIcon({
            path:                    iconPath,
            width:                   TILE_ICON_SIZE_PX,
            height:                  TILE_ICON_SIZE_PX,
            floatingAmplitude:       TILE_ICON_SIZE_PX * 0.1,
            floatingSecondsPerCycle: 3
        });
        this.#floatOffset = Math.random() * 5;
        EnemyContext.add(this);
    }

    get #targetTile() {
        return GAME_MAP_GRID.enemyPath[this.#targetTileIndex];
    }

    get distanceTraveled() {
        return this.#distanceTraveledInTiles;
    }

    get lives() {
        return this.#lives;
    }

    get moveSpeed() {
        return this.#moveSpeed;
    }

    get initialHealth() {
        return this.#initialHealth;
    }

    get health() {
        return this.#health;
    }

    get currencyValue() {
        return this.#currencyValue;
    }

    get iconPath() {
        return this.#iconPath;
    }

    destroy() {
        super.destroy();

        EnemyContext.delete(this);
    }

    protected _getHealthRatio() {
        return this.#health / this.#initialHealth;
    }

    protected _getCurrentPathIndex() {
        return Math.max(0, this.#targetTileIndex - 1);
    }

    get effectiveMoveSpeed() {
        return this.#isBeingDraggedToStart ? DRAG_SPEED
                                           : this.#moveSpeed;
    }

    isHit(positionPx: Point, paddingPx: number = 0) {
        return this.#icon.getBoundingBox(this.positionPx).pad(HIT_PADDING_PX + paddingPx).isPointInside(positionPx);
    }

    #updateTargetPoint(index: number) {
        if (index >= GAME_MAP_GRID.enemyPath.length) {
            this.destroy();
            PlayerLivesContext.value -= this.#lives;
            return;
        }

        index = Math.max(0, index);
        this.#targetTileIndex = index;
        // In case we've moved out of the normal order (e.g. drag or spam mail)
        this.#distanceTraveledInTiles = index;

        this.#isMovingLeft = this.#targetTile.x < this.tile.x;
    }

    #updateDragPosition(distanceInTiles: number) {
        if (!this.#isBeingDraggedToStart) {
            return;
        }

        const targetPositionPx = this.#targetTile.scale(TILE_SIZE_PX);
        this._positionPx = lerpPosition(this._positionPx, targetPositionPx, distanceInTiles * TILE_SIZE_PX);
        const distanceToTargetPx = this._positionPx.distanceTo(targetPositionPx);
        if (distanceToTargetPx < DRAG_DISTANCE_THRESHOLD_PX) {
            this.#isBeingDraggedToStart = false;
            this.#onBeingDraggedComplete?.(false /*cancelled*/);
        }
    }

    #moveTowardsTarget(distanceInTiles: number) {
        this.#distanceTraveledInTiles += distanceInTiles;
        const targetPositionPx = this.#targetTile.scale(TILE_SIZE_PX);
        this._positionPx = lerpPosition(this._positionPx, targetPositionPx, distanceInTiles * TILE_SIZE_PX);
        if (this._positionPx.equals(targetPositionPx)) {
            this.#distanceTraveledInTiles += 1;
            this.#updateTargetPoint(this.#targetTileIndex + 1);
        }
    }

    #updatePosition() {
        const distanceInTiles = this.effectiveMoveSpeed * (RENDER_CONTEXT.deltaTimeMs / 1000);
        if (!this.isBeingDraggedToStart) {
            this.#moveTowardsTarget(distanceInTiles);
        } else {
            this.#updateDragPosition(distanceInTiles);
        }
    }

    dragBackwards(onBeingDraggedComplete: () => void) {
        this.#onBeingDraggedComplete?.(true /*cancelled*/);
        this.#isBeingDraggedToStart = true;
        this.#onBeingDraggedComplete = onBeingDraggedComplete;

        this.#updateTargetPoint(this._getCurrentPathIndex() - BACKWARDS_DRAG_TILE_COUNT);
    }

    get isBeingDraggedToStart() {
        return this.#isBeingDraggedToStart;
    }

    protected _onKilled() {
        // in case two things damage us in the same frame?
        this.destroy();
        PlayerCurrencyContext.value += this.#currencyValue;
    }

    damage(amount: number) {
        this.#health -= amount;

        if (this.#health <= 0) {
            this._onKilled();
        }
    }

    #renderHealthBar() {
        const healthRatio = this._getHealthRatio();

        const x = this._positionPx.x + HEALTH_BAR_X_OFFSET_PX;
        const y = this._positionPx.y - HEALTH_BAR_Y_OFFSET_PX;

        CANVAS_CONTEXT.fillStyle = 'red';
        CANVAS_CONTEXT.fillRect(x, y, HEALTH_BAR_WIDTH_PX, HEALTH_BAR_HEIGHT_PX);

        const greenOffset = HEALTH_BAR_WIDTH_PX * healthRatio;
        CANVAS_CONTEXT.fillStyle = 'green';
        CANVAS_CONTEXT.fillRect(x, y, greenOffset, HEALTH_BAR_HEIGHT_PX);

        CANVAS_CONTEXT.strokeStyle = 'black';
        CANVAS_CONTEXT.strokeRect(x, y, HEALTH_BAR_WIDTH_PX, HEALTH_BAR_HEIGHT_PX);
    }

    tick() {
        this.#updatePosition();

        const iconPosition = this._positionPx.add({ x: TILE_ICON_OFFSET_PX });

        if (this.isBeingDraggedToStart) {
            this.#icon.renderWithoutFloating(iconPosition, this.#isMovingLeft);
        } else {
            this.#icon.render(iconPosition, this.createTime + this.#floatOffset, this.#isMovingLeft);
        }

        this.#renderHealthBar();
    }

    static getEnemiesInTileRange(tile: Point, maxDistanceTiles: number) {
        return Array.from(EnemyContext.values).filter(enemy => enemy.tile.manhattanDistanceTo(tile) <= maxDistanceTiles);
    }

    static getEnemiesInPxRange(positionPx: Point, maxDistancePx: number) {
        return Array.from(EnemyContext.values).filter(enemy => enemy.tile.scale(TILE_SIZE_PX).distanceTo(positionPx) <= maxDistancePx);
    }
}