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
import { ITowerDisplayData, ITowerTierBase } from '../models/tower.ts';

const INFECTION_TIME_MS = 15_000;
const INFECTION_IMMUNITY_MS = 15_000;
const INFECTION_FIRE_RATE_DEBUFF = 2;
const INFECTION_DAMAGE_DEBUFF = 0.5;

export interface ITowerConstructor<TTier extends ITowerTierBase> {
	displayData: ITowerDisplayData;
	tile: Point;
	tiers: TTier[];
}

export abstract class Tower<TTier extends ITowerTierBase = ITowerTierBase> extends LivingRenderObject {
	readonly #displayData: ITowerDisplayData;
	readonly #tile: Point;
	readonly #icon: Icon;
	readonly #iconPosition: Point;
	readonly #tiers: TTier[];
	#lastFireTime: number = 0;
	#infectionTimer: number = 0;
	#infectionImmunityTimer: number = 0;
	#currentTierIndex: number = 0;

	protected constructor({ tile, displayData, tiers }: ITowerConstructor<TTier>) {
		super({
			position: tile.scale(TILE_SIZE_PX)
		});

		this.#tiers = tiers;
		this.#displayData = displayData;
		this.#tile = tile;
		this.#icon = new Icon({
			path:   displayData.iconPath,
			height: TILE_ICON_SIZE_PX,
			width:  TILE_ICON_SIZE_PX
		});
		this.#iconPosition = this.#tile.scale(TILE_SIZE_PX).add({ x: TILE_ICON_OFFSET_PX, y: TILE_ICON_OFFSET_PX });
	}

	get displayData(): Readonly<ITowerDisplayData> {
		return this.#displayData;
	}

	get sellValue() {
		return Math.floor(this.#displayData.cost / 2);
	}

	get stats(): TTier {
		return this.#tiers[this.#currentTierIndex];
	}

	get range() {
		// account for being in the center of tile
		return this.stats.range + 0.5;
	}

	get damage() {
		return this.stats.damage;
	}

	get timeBetweenBulletsMs() {
		return this.stats.secondsBetweenBullets * 1000;
	}

	get effectiveTimeBetweenBulletsMs() {
		if (this.#infectionTimer > 0) {
			return this.timeBetweenBulletsMs * INFECTION_FIRE_RATE_DEBUFF;
		}

		return this.timeBetweenBulletsMs;
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

	getTileBoundsPx(): Box {
		const rect = CANVAS_CONTEXT.canvas.getBoundingClientRect();
		return new Box({
			x:      this._positionPx.x + rect.x,
			y:      this._positionPx.y + rect.y,
			width:  TILE_SIZE_PX,
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

	upgrade() {
		this.#currentTierIndex = Math.min(this.#tiers.length, this.#currentTierIndex + 1);
	}

	get tiers(): ReadonlyArray<TTier> {
		return this.#tiers;
	}

	get tierIndex() {
		return this.#currentTierIndex;
	}

	get canUpgrade() {
		return this.#currentTierIndex < (this.#tiers.length - 1);
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
			return Math.floor(this.damage * INFECTION_DAMAGE_DEBUFF);
		}

		return this.damage;
	}

	tick() {
		this.#tickInfection();

		const center = this.tileCenterPx;
		const isMouseOnTile = this.getTileBoundsPx().isPointInside(MousePositionContext.value);
		if (isMouseOnTile) {
			// Draw range indicator
			CANVAS_CONTEXT.fillStyle = 'rgba(255, 0, 0, 0.2)';
			CANVAS_CONTEXT.strokeStyle = 'rgba(255, 0, 0, 0.5)';
			CANVAS_CONTEXT.beginPath();
			CANVAS_CONTEXT.arc(center.x, center.y, this.range * TILE_SIZE_PX, 0, 2 * Math.PI);
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
				if (distanceInTiles <= this.range) {
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

	static* generateTowersInRange(center: Point, range: number): Generator<Tower> {
		for (const point of generateTilesInRange(center, range)) {
			const tile = GAME_MAP_GRID.getTile(point);
			if (tile instanceof Tower) {
				yield tile;
			}
		}
	}
}