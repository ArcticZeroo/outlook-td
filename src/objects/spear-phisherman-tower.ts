import { IPurchasableTowerConstructor } from '../models/tower.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { Spear } from './spear.ts';
import { Tower } from './tower.ts';

export class SpearPhishermanTower extends Tower {
    constructor({ tile, cost, iconPath }: IPurchasableTowerConstructor) {
        super({
            tile,
            cost,
            iconPath,
            damage:           5,
            range:            2.5,
            secondsPerBullet: 5,
        });
    }

    spawnBullet(target: EnemyPathMover, damage: number) {
        new Spear({
            position:         this.tileCenterPx,
            target,
            damage,
            speed:            6,
            maxDistanceTiles: this.range * 2,
            pierce:           2
        });
    }
}