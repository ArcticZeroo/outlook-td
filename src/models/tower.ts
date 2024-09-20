import { Tower } from '../objects/tower.ts';
import { Point } from '../util/point.ts';

export interface IPurchasableTowerConstructor {
    displayData: ITowerDisplayData;
    tile: Point;
}

export interface ITowerDisplayData {
    name: string;
    description: string;
    cost: number;
    iconPath: string;
    constructor: new (props: IPurchasableTowerConstructor) => Tower;
}

export interface ITowerTierBase {
    range: number;
    damage: number;
    secondsBetweenBullets: number;
}