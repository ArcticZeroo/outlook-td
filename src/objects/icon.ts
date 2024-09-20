import { CANVAS_CONTEXT } from '../context/canvas.ts';
import { Point } from '../util/point.ts';

export interface IIconConstructor {
    path: string;
    width: number;
    height: number;
}

export class Icon {
    protected _image: HTMLImageElement;
    protected _isImageLoaded: boolean = false;
    protected _width: number;
    protected _height: number;

    constructor({ path, height, width }: IIconConstructor) {
        this._image = new Image();
        this._image.addEventListener('load', () => {
            this._isImageLoaded = true;
        });
        this._image.src = path;
        this._image.width = width;
        this._image.height = height;

        this._width = width;
        this._height = height;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get size() {
        return new Point({
            x: this._width,
            y: this._height
        });
    }

    render(position: Point, flipHorizontally: boolean = false) {
        if (!this._isImageLoaded) {
            return;
        }

        let x = position.x;
        if (flipHorizontally) {
            x += this._width;
        }

        CANVAS_CONTEXT.translate(x, position.y);
        if (flipHorizontally) {
            CANVAS_CONTEXT.scale(-1, 1);
        }
        CANVAS_CONTEXT.drawImage(this._image, 0, 0, this._width, this._height);
        if (flipHorizontally) {
            CANVAS_CONTEXT.scale(-1, 1);
        }
        CANVAS_CONTEXT.translate(-x, -position.y);
    }
}

