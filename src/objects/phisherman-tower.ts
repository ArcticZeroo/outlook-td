import { IPurchasableTowerConstructor } from '../models/tower.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { FishingHook } from './fishing-hook.ts';
import { Tower } from './tower.ts';

export class PhishermanTower extends Tower {
    #isCurrentlyDragging = false;

    constructor({ tile, cost, iconPath }: IPurchasableTowerConstructor) {
        super({
            cost,
            tile,
            iconPath,
            damage:           0,
            range:            2,
            secondsPerBullet: 4
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
            position: this.tileCenterPx,
            speed: 12,
            onComplete: () => {
                this.#isCurrentlyDragging = false;
            }
        });
    }
}