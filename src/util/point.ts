import { Axis } from '../models/axis.ts';

interface IPointConstructor {
    x: number;
    y: number;
}

export class Point {
    readonly #x: number;
    readonly #y: number;

    constructor({ x, y }: IPointConstructor) {
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    add({ x = 0, y = 0 }: Partial<IPointConstructor>) {
        return new Point({ x: this.#x + x, y: this.#y + y });
    }

    subtract({ x = 0, y = 0 }: Partial<IPointConstructor>) {
        return new Point({ x: this.#x - x, y: this.#y - y });
    }

    scale(factor: number) {
        return new Point({ x: this.#x * factor, y: this.#y * factor });
    }

    moveInDirection(axis: Axis, amount: number) {
        if (axis === Axis.horizontal) {
            return new Point({ x: this.#x + amount, y: this.#y });
        } else {
            return new Point({ x: this.#x, y: this.#y + amount });
        }
    }

    distanceTo(other: Point): number {
        return this.subtract(other).magnitude;
    }

    manhattanDistanceTo(other: Point): number {
        return Math.abs(this.#x - other.x) + Math.abs(this.#y - other.y);
    }

    angleTo(other: Point): number {
        return Math.atan2(other.y - this.#y, other.x - this.#x);
    }

    clone() {
        return new Point({ x: this.#x, y: this.#y });
    }

    normalize() {
        const magnitude = this.magnitude;
        return this.scale(1 / magnitude);
    }

    equals(other: Point) {
        return this.#x === other.x && this.#y === other.y;
    }

    negative() {
        return new Point({ x: -this.#x, y: -this.#y });
    }

    static get zero() {
        return new Point({ x: 0, y: 0 });
    }
}