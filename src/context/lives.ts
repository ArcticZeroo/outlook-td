import { INITIAL_LIVES } from '../constants/initial.ts';
import { ValueListener } from '../util/event.ts';

export const PlayerLivesContext = new ValueListener<number>(INITIAL_LIVES);