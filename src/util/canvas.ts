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

export const drawCircle = (center: Point, radius: number, stroke: boolean = false) => {
    CANVAS_CONTEXT.beginPath();
    CANVAS_CONTEXT.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    CANVAS_CONTEXT.fill();
    if (stroke) {
        CANVAS_CONTEXT.stroke();
    }
    CANVAS_CONTEXT.closePath();
}