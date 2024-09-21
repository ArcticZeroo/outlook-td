import { ValueListener } from '../util/event.ts';

export const CurrentWaveContext = new ValueListener<number>(0);
export const TotalWaveContext = new ValueListener<number>(0);