import { IRenderObject } from '../models/render.ts';
import { TILE_ICON_OFFSET_PX } from '../constants/grid.ts';
import { CurrentWaveContext } from '../context/wave.ts';
import { writeOutlineText } from '../util/canvas.ts';

const OFFSET_X = TILE_ICON_OFFSET_PX;
const OFFSET_Y = OFFSET_X * 2;

export const WAVE_OBJECT: IRenderObject = {
	tick() {
		writeOutlineText(`Wave ${CurrentWaveContext.value + 1}`, OFFSET_X, OFFSET_Y);
	}
}