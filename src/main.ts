import { Spawner } from './objects/spawner.ts';
import { registerStatsViews } from './ui/controls/stats.ts';
import { registerTimeButtons } from './ui/controls/time.ts';
import { registerTowersView } from './ui/purchase.ts';
import { renderFrameLoop } from './ui/render.ts';

registerTimeButtons();
registerStatsViews();
registerTowersView();

renderFrameLoop();

new Spawner();
