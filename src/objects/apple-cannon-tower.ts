import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { IPurchasableTowerConstructor } from '../models/tower.ts';
import { translate } from '../util/canvas.ts';
import { AppleExplosive } from './apple-explosive.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { Icon } from './icon.ts';
import { Tower } from './tower.ts';

const ROTATION_OFFSET_RAD = Math.PI / 2;

export class AppleCannonTower extends Tower {
    readonly #splashRadiusTiles = 1;
    #rotationRad = 0;

    constructor({ tile, cost, iconPath }: IPurchasableTowerConstructor) {
        super({
            tile,
            cost,
            iconPath,
            damage:           3,
            range:            1,
            secondsPerBullet: 5
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
            position: this.tileCenterPx,
            targetPositionPx: target.tileCenterPx,
            speed: 3,
            splashRadiusTiles: this.#splashRadiusTiles
        });
    }
}