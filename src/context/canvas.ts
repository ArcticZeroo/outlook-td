import { Views } from '../ui/views.ts';

const ctx = Views.gameCanvas.getContext('2d');

if (ctx == null) {
    throw new Error('Could not get 2d context from game canvas');
}

export const CANVAS_CONTEXT = ctx;