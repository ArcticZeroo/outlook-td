import { assertElementIsExactHtml } from '../util/html.ts';

export const Views = {
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
    }
}