import { EnemyPathMover, IEnemyPathMoverConstructor } from './enemy-path-mover.ts';

const SPEED_INCREASE_PER_SPLIT = 1.1

interface ISpamEmailEnemyConstructor extends Omit<IEnemyPathMoverConstructor, 'lives' | 'health'> {
    originalSplitCount?: number;
    remainingSplitCount: number;
}

export class SpamEmailEnemy extends EnemyPathMover {
    readonly #remainingSplitCount: number;
    readonly #originalSplitCount: number;

    constructor({
                    moveSpeed,
                    currencyValue,
                    remainingSplitCount,
                    originalSplitCount = remainingSplitCount,
                    iconPath,
                    initialTileIndex
                }: ISpamEmailEnemyConstructor) {
        super({
            lives:  Math.pow(2, remainingSplitCount) + 1,
            health: 1,
            moveSpeed,
            iconPath,
            currencyValue,
            initialTileIndex
        });

        this.#remainingSplitCount = remainingSplitCount;
        this.#originalSplitCount = originalSplitCount;
    }

    protected _getHealthRatio(): number {
        if (this.#remainingSplitCount === 0) {
            return 0;
        }

        return this.#remainingSplitCount / this.#originalSplitCount;
    }

    damage(amount: number) {
        if (amount === 0) {
            return;
        }

        this._onKilled();

        if (this.#remainingSplitCount === 0) {
            return;
        }

        const currentPathIndex = this._getCurrentPathIndex();
        let offset = 0;
        if (currentPathIndex < 2) {
            offset = 1;
        }

        for (let i = 0; i < 2; i++) {
            const childTargetTileIndex = currentPathIndex - (i + 1) + offset;
            new SpamEmailEnemy({
                moveSpeed:           this._unscaledMoveSpeed * SPEED_INCREASE_PER_SPLIT,
                iconPath:            this.iconPath,
                currencyValue:       this.currencyValue,
                remainingSplitCount: this.#remainingSplitCount - 1,
                originalSplitCount:  this.#originalSplitCount,
                initialTileIndex:    childTargetTileIndex
            });
        }
    }
}