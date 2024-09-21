import { IPurchasableTowerConstructor, ITowerTierBase } from '../models/tower.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { FishingHook } from './fishing-hook.ts';
import { Tower } from './tower.ts';

const TIER_VALUES: ITowerTierBase[] = [
	{
		damage:   0,
		range:    1,
		secondsBetweenBullets: 8
	},
	{
		damage:   1,
		range:    1.5,
		secondsBetweenBullets: 7.5
	},
	{
		damage:   1,
		range:    2,
		secondsBetweenBullets: 7
	},
	{
		damage:   2,
		range:    2.25,
		secondsBetweenBullets: 6.5
	},
]

export class PhishermanTower extends Tower {
	#isCurrentlyDragging = false;

	constructor({ tile, displayData }: IPurchasableTowerConstructor) {
		super({
			tile,
			displayData,
			tiers: TIER_VALUES
		});
	}

	canAttackEnemy(enemy: EnemyPathMover): boolean {
		return !enemy.isBeingDraggedToStart;
	}

	protected isReadyToFire(): boolean {
		return !this.#isCurrentlyDragging;
	}

	spawnBullet(target: EnemyPathMover, damage: number): void {
		this.#isCurrentlyDragging = true;
		new FishingHook({
			target,
			damage,
			position:   this.tileCenterPx,
			speed:      12,
			onComplete: () => {
				this.#isCurrentlyDragging = false;
			}
		});
	}
}