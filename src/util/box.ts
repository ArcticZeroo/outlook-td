import { Point } from './point.ts';

interface IBoxConstructor {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Box {
    // top left corner coordinates
    readonly #x: number;
    readonly #y: number;
    readonly #width: number;
    readonly #height: number;

    constructor({ x, y, width, height }: IBoxConstructor) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
    }

    get topLeft(): Point {
        return new Point({ x: this.#x, y: this.#y });
    }

    get topRight() {
        return new Point({ x: this.#x + this.#width, y: this.#y });
    }

    get bottomRight() {
        return new Point({ x: this.#x + this.#width, y: this.#y + this.#height });
    }

    get bottomLeft() {
        return new Point({ x: this.#x, y: this.#y + this.#height });
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    pad(padding: number) {
        return new Box({
            x: this.#x - padding,
            y: this.#y - padding,
            width: this.#width + padding * 2,
            height: this.#height + padding * 2
        });
    }

    isPointInside(point: Readonly<Point>, isExclusive: boolean = true) {
        const topLeft = this.topLeft;
        const bottomRight = this.bottomRight;

        if (isExclusive) {
            return point.x > topLeft.x && point.x < bottomRight.x && point.y > topLeft.y && point.y < bottomRight.y;
        } else {
            return point.x >= topLeft.x && point.x <= bottomRight.x && point.y >= topLeft.y && point.y <= bottomRight.y;
        }
    }

    static fromDomRect(domRect: DOMRect) {
        return new Box({
            x: domRect.x,
            y: domRect.y,
            width: domRect.width,
            height: domRect.height
        });
    }
}