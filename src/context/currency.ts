import { INITIAL_CURRENCY } from '../constants/initial.ts';
import { ValueListener } from '../util/event.ts';

export const PlayerCurrencyContext = new ValueListener<number>(INITIAL_CURRENCY);