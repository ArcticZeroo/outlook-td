import { RENDER_CONTEXT } from '../context/render.ts';
import { Box } from '../util/box.ts';
import { getHeightOffset } from '../util/floating.ts';
import { Point } from '../util/point.ts';
import { Icon, IIconConstructor } from './icon.ts';

interface IFloatingIconConstructor extends IIconConstructor {
    floatingAmplitude?: number;
    floatingSecondsPerCycle?: number;
}

export class FloatingIcon {
    readonly #icon: Icon;
    readonly #floatingAmplitude: number;
    readonly #floatingSecondsPerCycle: number;

    constructor({ path, height, width, floatingAmplitude = 5, floatingSecondsPerCycle = 3 }: IFloatingIconConstructor) {
        this.#icon = new Icon({ path, height, width });
        this.#floatingAmplitude = floatingAmplitude;
        this.#floatingSecondsPerCycle = floatingSecondsPerCycle;
    }

    getBoundingBox(initialPoint: Point) {
        return new Box({
            x: initialPoint.x,
            y: initialPoint.y - this.#floatingAmplitude,
            width: this.#icon.width,
            height: this.#icon.height + (this.#floatingAmplitude * 2)
        });
    }

    renderWithoutFloating(position: Point, flipHorizontally: boolean = false) {
        this.#icon.render(position, flipHorizontally);
    }

    render(position: Point, timeOffset: number, flipHorizontally: boolean = false) {
        const time = RENDER_CONTEXT.timeNow + timeOffset;
        const visibleY = position.y + (getHeightOffset(time, this.#floatingAmplitude, this.#floatingSecondsPerCycle));
        this.#icon.render(new Point({
            x: position.x,
            y: visibleY
        }), flipHorizontally);
    }
}