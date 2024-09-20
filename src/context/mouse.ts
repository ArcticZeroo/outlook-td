import { ValueListener } from '../util/event.ts';
import { Point } from '../util/point.ts';

export const MousePositionContext = new ValueListener<Point>(Point.zero);

document.addEventListener('mousemove', (event) => {
    MousePositionContext.value = new Point({
        x: event.clientX,
        y: event.clientY
    });
});

export const MouseTileContext = new ValueListener<Point | null>(null);