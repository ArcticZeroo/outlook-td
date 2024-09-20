import MailIcon from '../assets/mail.svg';
import MalwareIcon from '../assets/malware.svg';
import SpamMailIcon from '../assets/spam-mail.svg';
import PlaneIcon from '../assets/plane.svg';
import { EnemyPathMover } from '../objects/enemy-path-mover.ts';
import { MalwareEnemy } from '../objects/malware-enemy.ts';
import { SpamEmailEnemy } from '../objects/spam-email-enemy.ts';

export const mailEnemy = () => new EnemyPathMover({
    moveSpeed:     0.55,
    lives:         10, // 10 minutes to respond to an email
    health:        5,
    currencyValue: 5,
    iconPath:      MailIcon,
});

export const planeEnemy = () => new EnemyPathMover({
    moveSpeed:     1.75,
    lives:         5, // quick email but high priority
    health:        4,
    currencyValue: 8,
    iconPath:      PlaneIcon,
});

export const teamsMeetingEnemy = () => new EnemyPathMover({
    moveSpeed:     0.75,
    lives:         30, // a "short meeting"
    health:        10,
    currencyValue: 10,
    iconPath:      './teams-meeting-icon.png',
});

export const managerEnemy = () => new EnemyPathMover({
    moveSpeed:     0.35,
    lives:         60, // 1-hour manager meeting
    health:        45,
    currencyValue: 25,
    iconPath:      './manager-icon.png',
});

export const walmartEnemy = () => new EnemyPathMover({
    moveSpeed:     0.05,
    lives:         60 * 2, // 2-hour walmart escalation
    health:        100,
    currencyValue: 80,
    iconPath:      './walmart-icon.png',
});

export const spamMailEnemy = (splitCount: number) => () => new SpamEmailEnemy({
    moveSpeed:           0.65,
    currencyValue:       5,
    iconPath:            SpamMailIcon,
    remainingSplitCount: splitCount
});

export const malwareEnemy = () => new MalwareEnemy({
    moveSpeed:     0.75,
    lives:         60, // malware might take an hour to recover?
    health:        15,
    currencyValue: 15,
    iconPath:      MalwareIcon,
});

export const allEnemies = [mailEnemy, planeEnemy, managerEnemy];