import { EnemyPathMover } from '../objects/enemy-path-mover.ts';
import { ValueListenerSet } from '../util/event.ts';

export const EnemyContext = new ValueListenerSet<EnemyPathMover>();