import { registerStatsViews } from './ui/controls/stats.ts';
import { registerTimeButtons } from './ui/controls/time.ts';
import { registerTowersView } from './ui/purchase.ts';
import { renderFrameLoop } from './ui/render.ts';
import { registerUpgradesView } from './ui/upgrades.ts';
import { registerRuntimeStyles } from './ui/css.ts';
import { resetGameObjects } from './objects/reset.ts';
import { registerGameOverView } from './ui/game-state.ts';

registerTimeButtons();
registerStatsViews();
registerTowersView();
registerUpgradesView();
registerRuntimeStyles();
registerGameOverView();

renderFrameLoop();

resetGameObjects();