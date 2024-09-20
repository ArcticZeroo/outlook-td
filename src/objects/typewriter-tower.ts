import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { RENDER_CONTEXT } from '../context/render.ts';
import { IPurchasableTowerConstructor, ITowerTierBase } from '../models/tower.ts';
import { writeOutlineText } from '../util/canvas.ts';
import { choice } from '../util/random.ts';
import { EnemyPathMover } from './enemy-path-mover.ts';
import { Tower } from './tower.ts';
import { TypewriterBullet } from './typewriter-bullet.ts';

const phrases = [
    'Could have been an email',
    'As per my last email',
    'Just following up',
    'Let\'s circle back',
    '(Automatic Reply) OOF in belize until 2026',
    'Gentle ping',
    'Not sure if you saw my last email',
    'Let\'s take this offline',
    'Any updates on this?',
    'Just a friendly reminder',
    'In case you missed it'
];

const PHRASE_CHANGE_TIME_MS = 1000;
const PHRASE_DEATH_TIME_MS = 500;

const TIER_VALUES: ITowerTierBase[] = [
    {
        damage: 1,
        range: 1,
        secondsBetweenBullets: 1.4
    },
    {
        damage: 1,
        range: 1.5,
        secondsBetweenBullets: 1.2
    },
    {
        damage: 2,
        range: 1.75,
        secondsBetweenBullets: 1
    }
];

export class TypewriterTower extends Tower {
    #currentPhrase: string = '';
    #phraseTimeLeft: number = 0;
    #phraseDeathTimeLeft: number = 0;

    constructor({ tile, displayData }: IPurchasableTowerConstructor) {
        super({
            tile,
            displayData,
            tiers: TIER_VALUES
        });
    }

    spawnBullet(target: EnemyPathMover, damage: number): void {
        if (!this.#currentPhrase || this.#phraseTimeLeft <= Number.EPSILON) {
            this.#currentPhrase = choice(phrases);
            if (!this.#currentPhrase.endsWith('?')) {
                this.#currentPhrase += '...';
            }
            this.#phraseTimeLeft = PHRASE_CHANGE_TIME_MS;
            this.#phraseDeathTimeLeft = PHRASE_DEATH_TIME_MS;
        }

        new TypewriterBullet({
            position: this.positionPx,
            target,
            speed: 6,
            maxDistanceTiles: Number.POSITIVE_INFINITY,
            phrase: this.#currentPhrase,
            onHit() {
                target.damage(damage);
            }
        });
    }

    tick() {
        super.tick();

        if (this.#phraseTimeLeft > 0) {
            this.#phraseTimeLeft -= RENDER_CONTEXT.deltaTimeMs;
        } else if (this.#phraseDeathTimeLeft > 0) {
            this.#phraseDeathTimeLeft -= RENDER_CONTEXT.deltaTimeMs;
        }

        if (this.#phraseTimeLeft > 0 || this.#phraseDeathTimeLeft > 0) {
            const width = CANVAS_CONTEXT.measureText(this.#currentPhrase).width;
            const centerX = this.tileCenterPx.x - (width / 2);
            writeOutlineText(this.#currentPhrase, centerX,this._positionPx.y);
        }
    }
}