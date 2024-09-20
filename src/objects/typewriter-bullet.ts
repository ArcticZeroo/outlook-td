import { writeOutlineText } from '../util/canvas.ts';
import { ITrackingBulletConstructor, TrackingBullet } from './tracking-bullet.ts';

interface ITypewriterBulletProps extends ITrackingBulletConstructor {
    phrase: string;
}

export class TypewriterBullet extends TrackingBullet {
    readonly #phrase: string;

    constructor({ phrase, ...props }: ITypewriterBulletProps) {
        super(props);
        this.#phrase = phrase;
    }

    tick() {
        super.tick();
        writeOutlineText(this.#phrase, this._positionPx.x, this._positionPx.y);
    }
}