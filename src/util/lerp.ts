import { Point } from './point.ts';

export const lerpPosition = (start: Point, end: Point, speed: number) => {
    const difference = end.subtract(start);
    const distance = difference.magnitude;

    if (distance === 0) {
        return start.clone();
    }

    const direction = difference.scale(1 / distance);
    const movement = direction.scale(speed);
    const newPosition = start.add(movement);
    if (newPosition.subtract(start).magnitude >= distance) {
        return end.clone();
    }

    return newPosition;
}