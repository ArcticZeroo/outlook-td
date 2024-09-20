import { IRenderObject } from '../models/render.ts';
import { GRID_RENDER_OBJECT } from '../objects/grid.ts';

const DYNAMIC_RENDER_OBJECTS: IRenderObject[] = [];

export const getRenderObjects = (): ReadonlyArray<IRenderObject> => [
    GRID_RENDER_OBJECT,
    ...DYNAMIC_RENDER_OBJECTS
];

export const addRenderObject = (object: IRenderObject): void => {
    DYNAMIC_RENDER_OBJECTS.push(object);
};

export const removeRenderObject = (object: IRenderObject): void => {
    const index = DYNAMIC_RENDER_OBJECTS.indexOf(object);
    if (index !== -1) {
        DYNAMIC_RENDER_OBJECTS.splice(index, 1);
    }
};