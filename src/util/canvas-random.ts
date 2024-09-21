import { RENDER_CONTEXT } from '../context/render.ts';

const RANDOM_SEED = Math.random() * 10_000;
let offset = 0;

const getSeed = () => {
    return RANDOM_SEED + offset++;
}

export const getCanvasBinnedRandom = (bin: number) => {
    const seed = getSeed();
    return Math.max(0, ((Math.floor(RENDER_CONTEXT.timeNow / bin) % seed) / seed));
}

export const getCanvasBinnedBetween = (min: number, max: number, bin: number) => {
    return getCanvasBinnedRandom(bin) * (max - min) + min;
}