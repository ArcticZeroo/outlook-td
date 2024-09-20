import { Views } from './views.ts';
import { TILE_ICON_SIZE_PX } from '../constants/grid.ts';

export const registerRuntimeStyles = () => {
	const head = Views.head;

	const style = document.createElement('style');
	style.innerHTML = `
.tower-icon {
	width: ${TILE_ICON_SIZE_PX}px;
	height: ${TILE_ICON_SIZE_PX}px;
}
`;

	head.appendChild(style);
 }