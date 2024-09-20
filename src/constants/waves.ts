import { EnemyPathMover } from '../objects/enemy-path-mover.ts';
import { mailEnemy, planeEnemy } from './enemies.ts';

interface IEnemySpawnData {
    enemy: () => EnemyPathMover;
    timeAfterLastSpawnMs?: number;
}

interface IMultipleEnemySpawnData extends IEnemySpawnData {
    count: number;
    timeBetweenSpawnsMs: number;
}

export const isMultipleEnemySpawnData = (data: IEnemySpawnData | IMultipleEnemySpawnData): data is IMultipleEnemySpawnData => {
    return data != null && (data as IMultipleEnemySpawnData).count !== undefined;
};

export type WaveInstructions = Array<Array<IEnemySpawnData | IMultipleEnemySpawnData>>;

export const getWaveCurrency = (waveIndex: number) => 20 + (waveIndex * 5);
export const TIME_BETWEEN_WAVES_MS = 5000;

export const waves: WaveInstructions = [
    // Wave 1
    [
        {
            enemy:                planeEnemy,
            timeAfterLastSpawnMs: 2000
        },
    ],
    [
        {
            enemy:               mailEnemy,
            count:               5,
            timeBetweenSpawnsMs: 6000
        }
    ],
    // Wave 2
    [
        {
            enemy:                mailEnemy,
            count:                3,
            timeBetweenSpawnsMs:  3000,
            timeAfterLastSpawnMs: 2000
        },
        {
            enemy: planeEnemy,
        },
    ],
    // Wave 3
    [
        {
            enemy:               mailEnemy,
            count:               3,
            timeBetweenSpawnsMs: 3000
        },
        {
            enemy:               planeEnemy,
            count:               2,
            timeBetweenSpawnsMs: 3000
        },
    ],
    // Wave 4
    [
        {
            enemy:               mailEnemy,
            count:               3,
            timeBetweenSpawnsMs: 3000
        },
        {
            enemy:               planeEnemy,
            count:               2,
            timeBetweenSpawnsMs: 3000
        },
        {
            enemy:               mailEnemy,
            count:               2,
            timeBetweenSpawnsMs: 1000
        },
    ]
];
