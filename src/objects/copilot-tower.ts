import { TILE_SIZE_PX } from '../constants/grid.ts';
import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { IPurchasableTowerConstructor, ITowerTierBase } from '../models/tower.ts';
import { timedSin } from '../util/math.ts';
import { Point } from '../util/point.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { Icon } from './icon.ts';
import { Lightning } from './lightning.ts';
import { Tower } from './tower.ts';

const MIN_SCALE_FACTOR = 1.1;
const MAX_SCALE_FACTOR = 1.15;
const SCALE_CYCLE_TIME_MS = 5_000;
const BLUR_AMOUNT = 1;
const HUE_CYCLE_TIME_MS = 10_000;

interface ICopilotTowerTier extends ITowerTierBase {
    maxTargetCount: number;
    maxLightningJumpDistance: number;
}

const TIER_VALUES: ICopilotTowerTier[] = [
    {
        damage:                   3,
        range:                    2,
        secondsBetweenBullets:    6,
        maxTargetCount:           2,
        maxLightningJumpDistance: 2.5
    },
    {
        damage:                   3,
        range:                    2.25,
        secondsBetweenBullets:    5.5,
        maxTargetCount:           3,
        maxLightningJumpDistance: 3
    },
    {
        damage:                   4,
        range:                    2.5,
        secondsBetweenBullets:    5,
        maxTargetCount:           3,
        maxLightningJumpDistance: 3.5
    },
    {
        damage:                   5,
        range:                    2.5,
        secondsBetweenBullets:    4.5,
        maxTargetCount:           5,
        maxLightningJumpDistance: 4,
    },
];

export class CopilotTower extends Tower<ICopilotTowerTier> {
    constructor({ tile, displayData }: IPurchasableTowerConstructor) {
        super({
            tile,
            displayData,
            tiers: TIER_VALUES
        });
    }

    spawnBullet(target: EnemyPathMover, damage: number) {
        new Lightning({
            position:                    this.tileCenterPx,
            maxTargetCount:              this.stats.maxTargetCount,
            maxDistanceBetweenTargetsPx: this.stats.maxLightningJumpDistance * TILE_SIZE_PX,
            target,
            damage,
        });
    }

    #renderBackgroundBlur(icon: Icon) {
        const scaleFactor = timedSin(this.timeSinceCreate, SCALE_CYCLE_TIME_MS) * (MAX_SCALE_FACTOR - MIN_SCALE_FACTOR) + MIN_SCALE_FACTOR;
        const unscaleFactor = 1 / scaleFactor;
        const hue = timedSin(this.timeSinceCreate, HUE_CYCLE_TIME_MS) * 180;

        const scaledWidth = icon.width * scaleFactor;
        const scaledHeight = icon.height * scaleFactor;
        const tileCenterPx = this.tileCenterPx;

        const scaledTopLeftX = tileCenterPx.x - (scaledWidth / 2);
        const scaledTopLeftY = tileCenterPx.y - (scaledHeight / 2);

        CANVAS_CONTEXT.translate(scaledTopLeftX, scaledTopLeftY);
        CANVAS_CONTEXT.scale(scaleFactor, scaleFactor);

        CANVAS_CONTEXT.filter = `contrast(0) sepia(100%) hue-rotate(${hue}deg) blur(${BLUR_AMOUNT}px) opacity(0.75)`;
        icon.render(Point.zero);

        CANVAS_CONTEXT.scale(unscaleFactor, unscaleFactor);
        CANVAS_CONTEXT.filter = 'none';

        CANVAS_CONTEXT.translate(-scaledTopLeftX, -scaledTopLeftY);
    }

    protected renderIcon(icon: Icon, iconPosition: Point) {
        this.#renderBackgroundBlur(icon);
        icon.render(iconPosition);
    }

    tick() {
        super.tick();
    }
}