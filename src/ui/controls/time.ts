import { TimeControlContext } from '../../context/time-control.ts';
import { Views } from '../views.ts';
import { GameStateContext } from '../../context/game-state.ts';
import { GameState } from '../../models/game.ts';

const createTimeButton = (id: string, value: number) => {
    const parent = Views.timeSpeedButtons;
    const button = document.createElement('button');
    button.type = 'button';
    button.addEventListener('click', () => {
        TimeControlContext.value = value;
    });
    button.id = id;
    if (value === 0) {
        button.textContent = 'Pause';
    } else {
        button.textContent = `x${value}`;
    }
    parent.appendChild(button);
}

const timeScales: Array<number> = [
    0,
    1,
    2,
    5
];

export const registerTimeButtons = () => {
    for (const scale of timeScales) {
        createTimeButton(`time-speed-${scale}`, scale);
    }

    document.addEventListener('keydown', (event) => {
        if (GameStateContext.value !== GameState.playing) {
            return;
        }

        if (event.key === ' ') {
            TimeControlContext.value = TimeControlContext.value === 0 ? 1 : 0;
            return;
        }

        const keyAsNumber = Number(event.key);
        if (!Number.isNaN(keyAsNumber) && timeScales.includes(keyAsNumber)) {
            TimeControlContext.value = keyAsNumber;
        }
    })

    TimeControlContext.drive(scale => {
        Views.timeSpeedDisplay.textContent = `Current speed: x${scale}`;
    });
}
