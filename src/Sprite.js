import DisplayObject from "./DisplayObject.js";

export default class Sprite extends DisplayObject {
    play = true;

    constructor(props = {}) {
        super(props);
        this.image = props.image ?? null;
        this.frame = props.frame ?? null;
        this.speedX = props.speedX ?? 0;
        this.speedY = props.speedY ?? 0;
        this.nextDirection = null;
    }

    getNextPosition() {
        return {
            x: this.x + this.speedX,
            y: this.y + this.speedY,
            width: this.width,
            height: this.height,
        }
    }

    draw(context) {
        if (this.frame) {
            context.drawImage(
                this.image,
                this.frame.x,
                this.frame.y,
                this.frame.width,
                this.frame.height,
                this.x,
                this.y,
                this.width,
                this.height,
            );

            super.draw(context)
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}