import { EnemyPathMover } from '../objects/enemy-path-mover.ts';
import {
	mailEnemy,
	malwareEnemy,
	managerEnemy,
	planeEnemy,
	spamMailEnemy,
	teamsMeetingEnemy,
	walmartEnemy
} from './enemies.ts';

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
	// Wave 1 - spawn speed is set so that a base typewriter can kill all enemies
	[
		{
			enemy:               mailEnemy,
			count:               15,
			timeBetweenSpawnsMs: 8000
		}
	],
	// Wave 2 - Enemies spawn closer together, you probably need a second tower/upgrade now
	[
		{
			enemy:               mailEnemy,
			count:               15,
			timeBetweenSpawnsMs: 6500
		},
	],
	// Wave 3 - Introduce the plane enemy, give the player some more time to clear out the mail enemies first
	[
		{
			enemy:                mailEnemy,
			count:                10,
			timeBetweenSpawnsMs:  6000,
			timeAfterLastSpawnMs: 10_000
		},
		{
			enemy: planeEnemy
		},
	],
	// Wave 4 - Two plane enemies
	[
		{
			enemy:                mailEnemy,
			count:                6,
			timeBetweenSpawnsMs:  5_500,
			timeAfterLastSpawnMs: 10_000
		},
		{
			enemy:                planeEnemy,
			count:                2,
			timeBetweenSpawnsMs:  7_000,
			timeAfterLastSpawnMs: 7_000
		},
		{
			enemy:               mailEnemy,
			count:               8,
			timeBetweenSpawnsMs: 6_000
		},
	],
	// Wave 5 - Introduce the teams meeting enemy
	[
		{
			enemy:                mailEnemy,
			count:                8,
			timeBetweenSpawnsMs:  6_000,
			timeAfterLastSpawnMs: 6_000
		},
		{
			enemy: teamsMeetingEnemy
		},
	],
	// Wave 6 - Two teams meeting enemies and a plane enemy
	[
		{
			enemy:                mailEnemy,
			count:                6,
			timeBetweenSpawnsMs:  5_000,
			timeAfterLastSpawnMs: 4_500
		},
		{
			enemy:                teamsMeetingEnemy,
			count:                2,
			timeBetweenSpawnsMs:  6_000,
			timeAfterLastSpawnMs: 8_000
		},
		{
			enemy: planeEnemy
		},
	],
	// Wave 7 - Introduce spam enemy
	[
		{
			enemy:                spamMailEnemy(2),
			timeAfterLastSpawnMs: 8_000
		},
		{
			enemy:               mailEnemy,
			count:               8,
			timeBetweenSpawnsMs: 5_000
		},
	],
	// Wave 8 - Second filler round
	[
		{
			enemy:                planeEnemy,
			timeAfterLastSpawnMs: 5_000,
		},
		{
			enemy:                mailEnemy,
			count:                8,
			timeBetweenSpawnsMs:  5_500,
			timeAfterLastSpawnMs: 5_500
		},
		{
			enemy:                planeEnemy,
			timeAfterLastSpawnMs: 6_000,
		},
		{
			enemy:               teamsMeetingEnemy,
			count:               3,
			timeBetweenSpawnsMs: 6_000
		},
	],
	// Wave 9 - Introduce malware enemy
	[
		{
			enemy:                malwareEnemy,
			count:                1,
			timeBetweenSpawnsMs:  5_000,
			timeAfterLastSpawnMs: 3_000,
		},
		{
			enemy:                mailEnemy,
			count:                6,
			timeBetweenSpawnsMs:  4_000,
			timeAfterLastSpawnMs: 3_000
		},
		{
			enemy:                malwareEnemy,
			timeAfterLastSpawnMs: 3_000
		},
		{
			enemy:               mailEnemy,
			count:               6,
			timeBetweenSpawnsMs: 4_000
		},
	],
	// Wave 10 - filler again
	[
		{
			enemy:                mailEnemy,
			count:                4,
			timeBetweenSpawnsMs:  3_500,
			timeAfterLastSpawnMs: 3_000
		},
		{
			enemy:                spamMailEnemy(3),
			count:                2,
			timeBetweenSpawnsMs:  8_000,
			timeAfterLastSpawnMs: 6_000
		},
		{
			enemy:                planeEnemy,
			timeAfterLastSpawnMs: 3_000,
		},
		{
			enemy:                teamsMeetingEnemy,
			count:                2,
			timeBetweenSpawnsMs:  5_000,
			timeAfterLastSpawnMs: 5_000
		},
	],
	// Wave 11 - Introduce manager email enemy
	[
		{
			enemy:                mailEnemy,
			count:                6,
			timeBetweenSpawnsMs:  3_000,
			timeAfterLastSpawnMs: 3_000
		},
		{
			enemy:                spamMailEnemy(3),
			timeAfterLastSpawnMs: 4_000,
		},
		{
			enemy: managerEnemy
		}
	],
	// Wave 12 - filler, give another manager with some teams meetings
	[
		{
			enemy:                teamsMeetingEnemy,
			count:                3,
			timeBetweenSpawnsMs:  4_000,
			timeAfterLastSpawnMs: 4_000
		},
		{
			enemy:                spamMailEnemy(3),
			timeAfterLastSpawnMs: 4_000,
		},
		{
			enemy:                managerEnemy,
			timeAfterLastSpawnMs: 10_000
		},
		{
			enemy:               mailEnemy,
			count:               6,
			timeBetweenSpawnsMs: 2_500
		},
	],
	// Wave 13 - Introduce walmart enemy
	[
		{
			enemy:                walmartEnemy,
			timeAfterLastSpawnMs: 5_000
		},
		{
			enemy:                malwareEnemy,
			timeAfterLastSpawnMs: 5_000
		},
		{
			enemy:               mailEnemy,
			count:               6,
			timeBetweenSpawnsMs: 2_500
		},
	]
];
