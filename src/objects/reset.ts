import { Spawner } from './spawner.ts';
import { clearRenderObjects } from '../context/objects.ts';

export const resetGameObjects = () => {
	clearRenderObjects();
	new Spawner();
}