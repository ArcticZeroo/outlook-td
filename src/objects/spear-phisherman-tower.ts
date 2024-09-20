import { IPurchasableTowerConstructor, ITowerTierBase } from '../models/tower.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { Spear } from './spear.ts';
import { Tower } from './tower.ts';

interface ISpearPhishermanTowerTier extends ITowerTierBase {
	spearMaxEnemiesHit: number;
	spearMaxDistanceTiles: number;
	spearSpeed: number;
}

const TIER_VALUES: ISpearPhishermanTowerTier[] = [
	{
		damage:                3,
		range:                 2,
		secondsBetweenBullets: 7,
		spearMaxEnemiesHit:    2,
		spearMaxDistanceTiles: 4,
		spearSpeed:            4
	},
	{
		damage:                4,
		range:                 2.5,
		secondsBetweenBullets: 6,
		spearMaxEnemiesHit:    2,
		spearMaxDistanceTiles: 4,
		spearSpeed:            5
	},
	{
		damage:                5,
		range:                 2.5,
		secondsBetweenBullets: 5,
		spearMaxEnemiesHit:    3,
		spearMaxDistanceTiles: 5,
		spearSpeed:            6
	},
];

export class SpearPhishermanTower extends Tower<ISpearPhishermanTowerTier> {

	constructor({ tile, displayData }: IPurchasableTowerConstructor) {
		super({
			tile,
			displayData,
			tiers: TIER_VALUES
		});
	}

	spawnBullet(target: EnemyPathMover, damage: number) {
		new Spear({
			target,
			damage,
			position:         this.tileCenterPx,
			speed:            this.stats.spearSpeed,
			maxDistanceTiles: this.stats.spearMaxDistanceTiles,
			pierce:           this.stats.spearMaxEnemiesHit
		});
	}
}