import { ValueListener } from '../util/event.ts';
import { GameState } from '../models/game.ts';

export const GameStateContext = new ValueListener<GameState>(GameState.playing);