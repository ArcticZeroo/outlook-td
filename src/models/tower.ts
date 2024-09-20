import { Tower } from '../objects/tower.ts';
import { Point } from '../util/point.ts';

export interface IPurchasableTowerConstructor {
    tile: Point;
    cost: number;
    iconPath: string;
}

export interface ITowerData {
    name: string;
    description: string;
    cost: number;
    iconPath: string;
    constructor: new (props: IPurchasableTowerConstructor) => Tower;
}
