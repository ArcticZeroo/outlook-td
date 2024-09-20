import { assertElementIsExactHtml } from '../util/html.ts';

export const Views = {
    get head() {
        return assertElementIsExactHtml(document.querySelector('head'), HTMLHeadElement);
    },
    get gameCanvas() {
        return assertElementIsExactHtml(document.querySelector('#game-canvas'), HTMLCanvasElement);
    },
    get currency() {
        return assertElementIsExactHtml(document.querySelector('#currency'), HTMLDivElement);
    },
    get lives() {
        return assertElementIsExactHtml(document.querySelector('#lives'), HTMLDivElement);
    },
    get timeSpeedButtons() {
        return assertElementIsExactHtml(document.querySelector('#time-speed-controls'), HTMLDivElement);
    },
    get timeSpeedDisplay() {
        return assertElementIsExactHtml(document.querySelector('#time-speed-display'), HTMLDivElement);
    },
    get towerList() {
        return assertElementIsExactHtml(document.querySelector('#towers'), HTMLDivElement);
    },
    get selectedTower() {
        return assertElementIsExactHtml(document.querySelector('#selected-tower'), HTMLDivElement);
    },
    get currentTier() {
        return assertElementIsExactHtml(document.querySelector('#current-tier'), HTMLDivElement);
    },
    get nextTier() {
        return assertElementIsExactHtml(document.querySelector('#next-tier'), HTMLDivElement);
    },
    get gameOver() {
        return assertElementIsExactHtml(document.querySelector('#game-over'), HTMLDivElement);
    },
    get restartButton() {
        return assertElementIsExactHtml(document.querySelector('#restart-button'), HTMLButtonElement);
    }
}