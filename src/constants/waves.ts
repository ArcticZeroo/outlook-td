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
			count:               6,
			timeBetweenSpawnsMs: 8000
		}
	],
	// Wave 2 - Enemies spawn closer together by a bit
	[
		{
			enemy:               mailEnemy,
			count:               8,
			timeBetweenSpawnsMs: 7000
		},
	],
	// Wave 3 - Introduce one teams meeting enemy
	[
		{
			enemy:                mailEnemy,
			count:                3,
			timeBetweenSpawnsMs:  5000,
			timeAfterLastSpawnMs: 6000
		},
		{
			enemy: teamsMeetingEnemy
		},
	],
	// Wave 4 - Add a second teams meeting enemy
	[
		{
			enemy:                mailEnemy,
			count:                2,
			timeBetweenSpawnsMs:  5000,
			timeAfterLastSpawnMs: 6000
		},
		{
			enemy:                teamsMeetingEnemy,
			count:                2,
			timeBetweenSpawnsMs:  5000,
			timeAfterLastSpawnMs: 5000
		},
		{
			enemy: mailEnemy
		},
	],
	// Wave 5 - Introduce the plane enemy
	[
		{
			enemy:                mailEnemy,
			count:                5,
			timeBetweenSpawnsMs:  4500,
			timeAfterLastSpawnMs: 4500
		},
		{
			enemy: planeEnemy
		},
	],
	// Wave 6 - Filler round that's a little harder
	[
		{
			enemy:                mailEnemy,
			count:                3,
			timeBetweenSpawnsMs:  4000,
			timeAfterLastSpawnMs: 4500
		},
		{
			enemy:                teamsMeetingEnemy,
			count:                3,
			timeBetweenSpawnsMs:  6000,
			timeAfterLastSpawnMs: 5000
		},
		{
			enemy: planeEnemy
		},
	],
	// Wave 7 - Introduce spam enemy
	[
		{
			enemy:                mailEnemy,
			timeAfterLastSpawnMs: 3000,
		},
		{
			enemy:                spamMailEnemy(2),
			timeAfterLastSpawnMs: 5000
		},
		{
			enemy:                mailEnemy,
			count:                4,
			timeAfterLastSpawnMs: 3000,
		},
	],
	// Wave 8 - Second filler round
	[
		{
			enemy:                planeEnemy,
			count:                2,
			timeBetweenSpawnsMs:  5000,
			timeAfterLastSpawnMs: 2000,
		},
		{
			enemy:                mailEnemy,
			count:                4,
			timeBetweenSpawnsMs:  3000,
			timeAfterLastSpawnMs: 3000
		},
		{
			enemy:               teamsMeetingEnemy,
			count:               3,
			timeBetweenSpawnsMs: 3500
		},
	],
	// Wave 9 - Introduce malware enemy
	[
		{
			enemy:                malwareEnemy,
			timeAfterLastSpawnMs: 1000,
		},
		{
			enemy:                mailEnemy,
			count:                2,
			timeBetweenSpawnsMs:  3000,
			timeAfterLastSpawnMs: 2000
		},
		{
			enemy:                malwareEnemy,
			timeAfterLastSpawnMs: 1000
		},
		{
			enemy:               mailEnemy,
			count:               4,
			timeBetweenSpawnsMs: 3000
		},
	],
	// Wave 10 - filler again
	[
		{
			enemy:                mailEnemy,
			count:                2,
			timeBetweenSpawnsMs:  2000,
			timeAfterLastSpawnMs: 3000
		},
		{
			enemy:                spamMailEnemy(2),
			count:                2,
			timeBetweenSpawnsMs:  6000,
			timeAfterLastSpawnMs: 6000
		},
		{
			enemy:                planeEnemy,
			timeAfterLastSpawnMs: 2000,
		},
		{
			enemy:                teamsMeetingEnemy,
			count:                2,
			timeBetweenSpawnsMs:  4000,
			timeAfterLastSpawnMs: 5000
		},
	],
	// Wave 11 - Introduce manager email enemy
	[
		{
			enemy:                mailEnemy,
			count:                3,
			timeBetweenSpawnsMs:  2000,
			timeAfterLastSpawnMs: 2000
		},
		{
			enemy:                spamMailEnemy(2),
			timeAfterLastSpawnMs: 4000,
		},
		{
			enemy:                managerEnemy,
			timeAfterLastSpawnMs: 10_000
		}
	],
	// Wave 12 - filler, give another manager with some teams meetings
	[
		{
			enemy:                teamsMeetingEnemy,
			count:                3,
			timeBetweenSpawnsMs:  2000,
			timeAfterLastSpawnMs: 2000
		},
		{
			enemy:                spamMailEnemy(3),
			timeAfterLastSpawnMs: 4000,
		},
		{
			enemy:                managerEnemy,
			timeAfterLastSpawnMs: 10_000
		},
		{
			enemy:               mailEnemy,
			count:               3,
			timeBetweenSpawnsMs: 2000
		},
	],
	// Wave 13 - Introduce walmart enemy
	[
		{
			enemy: walmartEnemy
		}
	]
];
