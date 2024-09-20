import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { timedSin } from '../util/math.ts';
import { Point } from '../util/point.ts';
import { TrackingBullet } from './tracking-bullet.ts';

const INFECTION_CYCLE_MS = 5_000;
const LINE_COUNT = 4;
const LINE_CHARS = 4;
const TOTAL_CHAR_COUNT = LINE_COUNT * LINE_CHARS;
const NUMBER_REQUIRED = 2 ** ((LINE_CHARS * LINE_COUNT) + 1);

export const renderInfectionEffect = (center: Point, timeOffset: number) => {
    const value = Math.round((timedSin(RENDER_CONTEXT.timeNow + timeOffset, INFECTION_CYCLE_MS) + 1) * NUMBER_REQUIRED);

    const binaryValue = value.toString(2).padStart(TOTAL_CHAR_COUNT, '0');

    const oldFont = CANVAS_CONTEXT.font;
    CANVAS_CONTEXT.font = 'monospace';

    const lineSize = CANVAS_CONTEXT.measureText('0000');
    const lineHeight = lineSize.fontBoundingBoxAscent + lineSize.fontBoundingBoxDescent;
    const lineWidth = lineSize.width;

    for (let i = 0; i < LINE_COUNT; i++) {
        const line = binaryValue.slice(i * LINE_CHARS, (i + 1) * LINE_CHARS);

        CANVAS_CONTEXT.fillStyle = 'green';
        CANVAS_CONTEXT.fillText(line, center.x - (lineWidth / 2), center.y + (i * lineHeight));
    }

    CANVAS_CONTEXT.font = oldFont;
}

export class InfectionBullet extends TrackingBullet {
    tick() {
        super.tick();
        renderInfectionEffect(this.positionPx, this.createTime);
    }
}