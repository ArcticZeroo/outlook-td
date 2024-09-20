import { Tower } from '../objects/tower.ts';
import { ValueListener } from '../util/event.ts';

export const SelectedTowerContext = new ValueListener<Tower | null>(null);