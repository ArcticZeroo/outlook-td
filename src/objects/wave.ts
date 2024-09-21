import { IRenderObject } from '../models/render.ts';
import { TILE_ICON_OFFSET_PX } from '../constants/grid.ts';
import { CurrentWaveContext, TotalWaveContext } from '../context/wave.ts';
import { writeOutlineText } from '../util/canvas.ts';

const OFFSET_X = TILE_ICON_OFFSET_PX;
const OFFSET_Y = OFFSET_X * 2;

export const WAVE_OBJECT: IRenderObject = {
	tick() {
		const isInEndlessMode = CurrentWaveContext.value >= TotalWaveContext.value;
		const text = isInEndlessMode
					 ? 'Endless Mode'
					 : `Wave ${CurrentWaveContext.value + 1} of ${TotalWaveContext.value}`;
		writeOutlineText(text, OFFSET_X, OFFSET_Y);
	}
}