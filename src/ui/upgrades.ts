import { SelectedUpgradeTowerContext } from '../context/tower.ts';
import { Views } from './views.ts';
import { MouseTileHoverContext } from '../context/mouse.ts';
import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { GAME_MAP_GRID } from '../util/grid.ts';
import { Tower } from '../objects/tower.ts';
import { ITowerTierBase } from '../models/tower.ts';
import { PlayerCurrencyContext } from '../context/currency.ts';
import { multiDrive } from '../util/event.ts';
import { getTierCost } from '../util/tower.ts';

const renderTier = <T extends ITowerTierBase>(parent: HTMLElement, tier: T, name: string) => {
	parent.innerHTML = `<span>${name}</span>`;

	const tierElement = document.createElement('table');

	for (const [key, value] of Object.entries(tier)) {
		const rowElement = document.createElement('tr');
		rowElement.innerHTML = `
			<td>${key}</td>
			<td>${value}</td>
`;
		tierElement.appendChild(rowElement);
	}

	parent.appendChild(tierElement);
}

const renderSelectedTower = (selectedTowerElement: HTMLElement, selectedTower: Readonly<Tower>) => {
	selectedTowerElement.innerHTML = `
			<img class="tower-icon" src="${selectedTower.displayData.iconPath}" alt="Tower icon"/>
			<span>${selectedTower.displayData.name}</span>
			<span>Tier ${selectedTower.tierIndex + 1}${selectedTower.canUpgrade ? '' : '(Fully Upgraded)'}</span>
		`;

	const deselectButton = document.createElement('button');
	deselectButton.type = 'button';
	deselectButton.innerText = 'Deselect';
	deselectButton.addEventListener('click', () => {
		SelectedUpgradeTowerContext.value = null;
	});

	selectedTowerElement.appendChild(deselectButton);
}

export const registerUpgradesView = () => {
	const selectedTowerElement = Views.selectedTower;
	const currentTierElement = Views.currentTier;
	const nextTierElement = Views.nextTier;

	multiDrive(() => {
		const selectedTower = SelectedUpgradeTowerContext.value;
		const playerCurrency = PlayerCurrencyContext.value;

		const visibility = selectedTower == null ? 'hidden' : 'visible';
		currentTierElement.style.visibility = visibility;
		nextTierElement.style.visibility = visibility;

		currentTierElement.innerHTML = '';
		nextTierElement.innerHTML = '';

		if (selectedTower == null) {
			selectedTowerElement.innerText = 'Click on a tower to view available upgrades.';
			return;
		}

		renderSelectedTower(selectedTowerElement, selectedTower);

		renderTier(currentTierElement, selectedTower.stats, 'Current Tier');

		if (!selectedTower.canUpgrade) {
			nextTierElement.style.visibility = 'hidden';
			return;
		}

		const nextTierIndex = selectedTower.tierIndex + 1;
		const nextTier = selectedTower.tiers[nextTierIndex];
		renderTier(nextTierElement, nextTier, 'Next Tier');

		const nextTierCost = getTierCost(nextTierIndex, selectedTower.displayData.cost);
		const costElement = document.createElement('span');
		costElement.innerText = `Cost: 🪙 ${nextTierCost}`;
		nextTierElement.appendChild(costElement);

		const canAffordUpgrade = playerCurrency >= nextTierCost;
		const upgradeButton = document.createElement('button');
		upgradeButton.type = 'button';
		upgradeButton.innerText = 'Upgrade';
		upgradeButton.disabled = !canAffordUpgrade;
		upgradeButton.addEventListener('click', () => {
			if (!canAffordUpgrade) {
				return;
			}

			const selectedTower = SelectedUpgradeTowerContext.value;
			if (selectedTower == null || !selectedTower.canUpgrade) {
				return;
			}

			selectedTower.upgrade();
			PlayerCurrencyContext.value -= nextTierCost;
		});

		nextTierElement.appendChild(upgradeButton);
	}, [PlayerCurrencyContext, SelectedUpgradeTowerContext]);

	CANVAS_CONTEXT.canvas.addEventListener('click', () => {
		const selectedTile = MouseTileHoverContext.value;
		if (!selectedTile) {
			return;
		}

		const maybeTower = GAME_MAP_GRID.getTile(selectedTile);
		if (maybeTower instanceof Tower) {
			SelectedUpgradeTowerContext.value = maybeTower;
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			SelectedUpgradeTowerContext.value = null;
		}
	});
}