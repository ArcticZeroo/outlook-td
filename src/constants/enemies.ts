import MailIcon from '../assets/mail.svg';
import MalwareIcon from '../assets/malware.svg';
import SpamMailIcon from '../assets/spam-mail.svg';
import PlaneIcon from '../assets/plane.svg';
import { EnemyPathMover } from '../objects/enemy-path-mover.ts';
import { MalwareEnemy } from '../objects/malware-enemy.ts';
import { SpamEmailEnemy } from '../objects/spam-email-enemy.ts';

export const mailEnemy = (initialTileIndex?: number) => new EnemyPathMover({
	moveSpeed:     0.55,
	lives:         10, // 10 minutes to respond to an email
	health:        5,
	currencyValue: 5,
	iconPath:      MailIcon,
	initialTileIndex
});

export const planeEnemy = (initialTileIndex?: number) => new EnemyPathMover({
	moveSpeed:     1.25,
	lives:         5, // quick email but high priority
	health:        8,
	currencyValue: 10,
	iconPath:      PlaneIcon,
	initialTileIndex
});

export const teamsMeetingEnemy = () => new EnemyPathMover({
	moveSpeed:     0.6,
	lives:         30, // a "short meeting"
	health:        15,
	currencyValue: 15,
	iconPath:      './teams-meeting-icon.png',
});

export const managerEnemy = () => new EnemyPathMover({
	moveSpeed:                 0.45,
	lives:                     60, // 1-hour manager meeting
	health:                    55,
	currencyValue:             30,
	iconPath:                  './manager-icon.png',
	timeBetweenMinionSpawnsMs: 8_000,
	fastMinionSpawnChance:     0.1
});

export const walmartEnemy = () => new EnemyPathMover({
	moveSpeed:                 0.05,
	lives:                     60 * 4, // 4-hour walmart escalation
	health:                    200,
	currencyValue:             85,
	iconPath:                  './walmart-icon.png',
	timeBetweenMinionSpawnsMs: 4_000,
	fastMinionSpawnChance:     0.2
});

export const spamMailEnemy = (splitCount: number) => () => new SpamEmailEnemy({
	moveSpeed:           0.6,
	currencyValue:       5,
	iconPath:            SpamMailIcon,
	remainingSplitCount: splitCount
});

export const malwareEnemy = () => new MalwareEnemy({
	moveSpeed:     0.65,
	lives:         60, // malware might take an hour to recover?
	health:        15,
	currencyValue: 25,
	iconPath:      MalwareIcon,
});

EnemyPathMover.initMinions(mailEnemy, planeEnemy);

export const allEnemies = [
	mailEnemy,
	planeEnemy,
	managerEnemy,
	teamsMeetingEnemy,
	walmartEnemy,
	spamMailEnemy(2),
	spamMailEnemy(3),
	malwareEnemy,
];