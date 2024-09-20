import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { Point } from './point.ts';

export const writeOutlineText = (text: string, x: number, y: number) => {
    CANVAS_CONTEXT.save();
    CANVAS_CONTEXT.fillStyle = 'white';
    CANVAS_CONTEXT.strokeStyle = 'black';
    CANVAS_CONTEXT.lineWidth = 2;
    CANVAS_CONTEXT.font = '16px sans-serif';
    CANVAS_CONTEXT.strokeText(text, x, y);
    CANVAS_CONTEXT.fillText(text, x, y);
    CANVAS_CONTEXT.restore();
}

export const translate = (amount: Point) => {
    CANVAS_CONTEXT.translate(amount.x, amount.y);
}