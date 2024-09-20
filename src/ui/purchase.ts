import { towers } from '../constants/towers.ts';
import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { PlayerCurrencyContext } from '../context/currency.ts';
import { MousePositionContext, MouseTileHoverContext } from '../context/mouse.ts';
import { MapTileType } from '../models/map.ts';
import { ITowerDisplayData } from '../models/tower.ts';
import { Tower } from '../objects/tower.ts';
import { Box } from '../util/box.ts';
import { GAME_MAP_GRID } from '../util/grid.ts';
import { Views } from './views.ts';
import { SelectedPlaceTowerContext, SelectedUpgradeTowerContext } from '../context/tower.ts';
import { GameStateContext } from '../context/game-state.ts';
import { GameState } from '../models/game.ts';

export const registerTowersView = () => {
	const towersElement = Views.towerList;

	const towerGroupsByName: Map<string, HTMLElement> = new Map();

	const selectTower = (tower: ITowerDisplayData) => {
		if (GameStateContext.value != GameState.playing) {
			return;
		}

		SelectedPlaceTowerContext.value = tower;
	};

	SelectedPlaceTowerContext.drive(selectedTower => {
		for (const [name, element] of towerGroupsByName) {
			element.classList.toggle('selected', name === selectedTower?.name);
		}
	});

	for (const tower of towers) {
		const towerGroupElement = document.createElement('div');
		towerGroupElement.className = 'tower rounded-container';
		towerGroupElement.title = `Click to select the ${tower.name} tower.`;

		towerGroupElement.innerHTML = `
            <div class="flex align-center">
                <img class="tower-icon" src="${tower.iconPath}" alt="${tower.name}" />
                <div class="tower-info">
                    <span>${tower.name}</span>
                    <span class="subtitle tower-description">${tower.description}</span>
                </div>
            </div>
            <span>🪙 ${tower.cost}</span>
        `;

		towerGroupElement.addEventListener('click', () => selectTower(tower));

		towerGroupsByName.set(tower.name, towerGroupElement);

		towersElement.appendChild(towerGroupElement);
	}

	CANVAS_CONTEXT.canvas.addEventListener('click', (event) => {
		const selectedTower = SelectedPlaceTowerContext.value;
		if (!selectedTower) {
			return;
		}

		if (GameStateContext.value != GameState.playing) {
			return;
		}

		const selectedTile = MouseTileHoverContext.value;
		if (!selectedTile) {
			return;
		}

		if (GAME_MAP_GRID.getTile(selectedTile) !== MapTileType.placeable) {
			return;
		}

		if (PlayerCurrencyContext.value < selectedTower.cost) {
			return;
		}

		event.preventDefault();

		PlayerCurrencyContext.value -= selectedTower.cost;
		const tower = new selectedTower.constructor({
			tile:        selectedTile.clone(),
			displayData: selectedTower
		});

		GAME_MAP_GRID.placeTower(selectedTile, tower);
		SelectedUpgradeTowerContext.value = tower;
	});

	document.addEventListener('contextmenu', (event) => {
		const canvasBox = Box.fromDomRect(CANVAS_CONTEXT.canvas.getBoundingClientRect());
		if (!canvasBox.isPointInside(MousePositionContext.value)) {
			return;
		}

		event.preventDefault();

		const selectedTile = MouseTileHoverContext.value;
		if (selectedTile == null) {
			return;
		}

		const maybeTower = GAME_MAP_GRID.getTile(selectedTile);
		if (maybeTower instanceof Tower) {
			maybeTower.destroy();
			GAME_MAP_GRID.removeTower(selectedTile);
			PlayerCurrencyContext.value += maybeTower.sellValue;
			if (SelectedUpgradeTowerContext.value === maybeTower) {
				SelectedUpgradeTowerContext.value = null;
			}
		}
	});
};