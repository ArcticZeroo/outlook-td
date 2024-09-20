import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { ITowerTierBase, IPurchasableTowerConstructor } from '../models/tower.ts';
import { translate } from '../util/canvas.ts';
import { AppleExplosive } from './apple-explosive.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { Icon } from './icon.ts';
import { Tower } from './tower.ts';

const ROTATION_OFFSET_RAD = Math.PI / 2;

interface IAppleCannonTowerTier extends ITowerTierBase {
	splashRadiusTiles: number;
	appleMoveSpeed: number;
}

const TIER_VALUES: Array<IAppleCannonTowerTier> = [
	{
		damage:                3,
		range:                 1,
		secondsBetweenBullets: 5,
		splashRadiusTiles:     1,
		appleMoveSpeed:        3,
	},
	{
		damage:                4,
		range:                 2,
		secondsBetweenBullets: 4,
		splashRadiusTiles:     2,
		appleMoveSpeed:        4,
	},
	{
		damage:                4,
		range:                 2,
		secondsBetweenBullets: 3,
		splashRadiusTiles:     3,
		appleMoveSpeed:        5,
	}
];

export class AppleCannonTower extends Tower<IAppleCannonTowerTier> {
	#rotationRad = 0;

	constructor({ tile, displayData }: IPurchasableTowerConstructor) {
		super({
			tile,
			displayData,
			tiers: TIER_VALUES
		});
	}

	protected renderIcon(icon: Icon) {
		const iconSizeOffset = icon.size.scale(0.5);

		CANVAS_CONTEXT.save();
		translate(this.tileCenterPx);
		CANVAS_CONTEXT.rotate(this.#rotationRad + ROTATION_OFFSET_RAD);
		super.renderIcon(icon, iconSizeOffset.negative());
		CANVAS_CONTEXT.restore();
	}

	spawnBullet(target: EnemyPathMover, damage: number): void {
		this.#rotationRad = this.tileCenterPx.angleTo(target.tileCenterPx);

		new AppleExplosive({
			damage,
			position:          this.tileCenterPx,
			targetPositionPx:  target.tileCenterPx,
			speed:             3,
			splashRadiusTiles: this.stats.splashRadiusTiles
		});
	}
}