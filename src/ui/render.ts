import { CANVAS_SIZE_PX } from '../constants/grid.ts';
import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { getRenderObjects } from '../context/objects.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { TimeControlContext } from '../context/time-control.ts';

let lastFrameTime = -1;
const renderFrame = (timeNow: number) => {
    CANVAS_CONTEXT.moveTo(0, 0);
    CANVAS_CONTEXT.fillStyle = '#80ab74';
    CANVAS_CONTEXT.fillRect(0, 0, CANVAS_SIZE_PX, CANVAS_SIZE_PX);

    if (lastFrameTime === -1) {
        RENDER_CONTEXT.timeNow = timeNow;
        RENDER_CONTEXT.deltaTimeMs = 0;
    } else {
        const timeSinceLastFrameMs = timeNow - lastFrameTime;
        const scaledTimeSinceLastFrameMs = timeSinceLastFrameMs * TimeControlContext.value;
        RENDER_CONTEXT.timeNow += scaledTimeSinceLastFrameMs;
        RENDER_CONTEXT.deltaTimeMs = scaledTimeSinceLastFrameMs;
    }

    for (const object of getRenderObjects()) {
        object.tick();
    }

    lastFrameTime = timeNow;
}

export const renderFrameLoop = () => {
    requestAnimationFrame((timeNow) => {
        renderFrame(timeNow);
        renderFrameLoop();
    });
}