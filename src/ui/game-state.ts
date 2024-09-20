import { Views } from './views.ts';
import { TimeControlContext } from '../context/time-control.ts';
import { GameStateContext } from '../context/game-state.ts';
import { GameState } from '../models/game.ts';
import { PlayerLivesContext } from '../context/lives.ts';
import { INITIAL_CURRENCY, INITIAL_LIVES } from '../constants/initial.ts';
import { PlayerCurrencyContext } from '../context/currency.ts';
import { resetGameObjects } from '../objects/reset.ts';
import { SelectedPlaceTowerContext, SelectedUpgradeTowerContext } from '../context/tower.ts';

export const registerGameOverView = () => {
	PlayerLivesContext.drive(lives => {
		if (lives <= 0) {
			GameStateContext.value = GameState.gameOver;
		}
	});

	GameStateContext.drive(gameState => {
		const gameOverElement = Views.gameOver;
		gameOverElement.style.display = gameState === GameState.gameOver
			? ''
			: 'none';

		if (gameState === GameState.gameOver) {
			TimeControlContext.value = 0;
			SelectedUpgradeTowerContext.value = null;
			SelectedPlaceTowerContext.value = null;
		}
	});

	const restartButton = Views.restartButton;
	restartButton.addEventListener('click', () => {
		GameStateContext.value = GameState.playing;
		PlayerLivesContext.value = INITIAL_LIVES;
		PlayerCurrencyContext.value = INITIAL_CURRENCY;
		TimeControlContext.value = 1;
		resetGameObjects();
	});
}