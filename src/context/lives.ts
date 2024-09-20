import { INITIAL_LIVES } from '../constants/initial.ts';
import { ValueListener } from '../util/event.ts';

export const LivesNotifier = new ValueListener<number>(INITIAL_LIVES);