import { towers } from '../constants/towers.ts';
import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { PlayerCurrencyContext } from '../context/currency.ts';
import { MousePositionContext, MouseTileContext } from '../context/mouse.ts';
import { MapTileType } from '../models/map.ts';
import { ITowerData } from '../models/tower.ts';
import { Tower } from '../objects/tower.ts';
import { Box } from '../util/box.ts';
import { GAME_MAP_GRID } from '../util/grid.ts';
import { Views } from './views.ts';

export const registerTowersView = () => {
    const towersElement = Views.towerList;
    let selectedTower: ITowerData | null = null;

    const towerGroupsByName: Map<string, HTMLElement> = new Map();

    const selectTower = (tower: ITowerData) => {
        selectedTower = tower;
        for (const [name, element] of towerGroupsByName) {
            element.classList.toggle('selected', name === tower.name);
        }
    }

    for (const tower of towers) {
        const towerGroupElement = document.createElement('div');
        towerGroupElement.className = 'tower rounded-container';
        towerGroupElement.title = `Click to select the ${tower.name} tower.`;

        towerGroupElement.innerHTML = `
            <div class="flex align-center">
                <img src="${tower.iconPath}" alt="${tower.name}" />
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

    document.addEventListener('click', (event) => {
        if (!selectedTower) {
            return;
        }

        const selectedTile = MouseTileContext.value;
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
            tile:     selectedTile.clone(),
            cost:     selectedTower.cost,
            iconPath: selectedTower.iconPath
        });
        GAME_MAP_GRID.placeTower(selectedTile, tower);
    });

    document.addEventListener('contextmenu', (event) => {
        const canvasBox = Box.fromDomRect(CANVAS_CONTEXT.canvas.getBoundingClientRect());
        if (!canvasBox.isPointInside(MousePositionContext.value)) {
            return;
        }

        event.preventDefault();

        const selectedTile = MouseTileContext.value;
        if (selectedTile == null) {
            return;
        }

        const maybeTower = GAME_MAP_GRID.getTile(selectedTile);
        if (maybeTower instanceof Tower) {
            maybeTower.destroy();
            GAME_MAP_GRID.removeTower(selectedTile);
            PlayerCurrencyContext.value += maybeTower.sellValue;
        }
    });
};