import { Tower } from '../objects/tower.ts';
import { ValueListener } from '../util/event.ts';
import { ITowerDisplayData } from '../models/tower.ts';

export const SelectedUpgradeTowerContext = new ValueListener<Tower | null>(null);

export const SelectedPlaceTowerContext = new ValueListener<ITowerDisplayData | null>(null);