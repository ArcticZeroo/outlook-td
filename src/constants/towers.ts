import TypewriterSvg from '../assets/typewriter.svg';
import PhishermanSvg from '../assets/phisherman.svg';
import SpearPhishermanSvg from '../assets/spear penguin.svg';
import CopilotSvg from '../assets/copilot.svg';
import AppleCannonSvg from '../assets/apple cannon.svg';
import { ITowerDisplayData } from '../models/tower.ts';
import { AppleCannonTower } from '../objects/apple-cannon-tower.ts';
import { CopilotTower } from '../objects/copilot-tower.ts';
import { PhishermanTower } from '../objects/phisherman-tower.ts';
import { SpearPhishermanTower } from '../objects/spear-phisherman-tower.ts';
import { TypewriterTower } from '../objects/typewriter-tower.ts';

export const towers: ITowerDisplayData[] = [
    {
        name:        'Typewriter',
        description: 'A basic tower that sends many short but fast-paced email replies.',
        cost:        75,
        iconPath:    TypewriterSvg,
        constructor: TypewriterTower
    },
    {
        name:        'Phisherman',
        description: 'A tower that catches emails with a fishing rod to move them back in the lane.',
        cost:        120,
        iconPath:    PhishermanSvg,
        constructor: PhishermanTower
    },
    {
        name:        'Spear Phisherman',
        description: 'A tower that sends a spear to pierce through multiple enemies.',
        cost:        135,
        iconPath:    SpearPhishermanSvg,
        constructor: SpearPhishermanTower
    },
    {
        name:        'Apple Cannon',
        description: 'Shoots explosive apples that can damage multiple enemies at once',
        cost:        150,
        iconPath:    AppleCannonSvg,
        constructor: AppleCannonTower
    },
    {
        name:        'Copilot',
        description: 'A magical tower that sends lightning bolts which chain across multiple nearby enemies.',
        cost:        250,
        iconPath:    CopilotSvg,
        constructor: CopilotTower
    }
];
