import Sprite from './Sprite.js';

export default class Cinematic extends Sprite {
    constructor(props = {}) {
        super(props);
        this.animations = props.animations ?? {};
        this.animation = null;
        this.interval = 0;
        this.timer = 0;
        this.frameNumber = 0;
        this.onEnd = null;
    }

    start(animationName, params = {}) {
        const animation = this.animations.find((animation) => animation.name === animationName);

        if (animation && this.animation !== animation) {
            this.animation = animation;
            this.interval = this.animation.duration / this.animation.frames.length;
            this.timer = 0;
            this.frameNumber = 0;
            this.frame = this.animation.frames[0]

            if (params.onEnd) this.onEnd = params.onEnd;
        }
    }

    stop() {
        this.animation = null;
        this.interval = 0;
        this.timer = 0;
        this.frameNumber = 0;
        this.frame = null;
    }

    update(delta) {
        super.update(delta);

        if (this.animation) {
            this.timer += delta;

            if (this.timer >= this.interval) {
                this.frameNumber = (this.frameNumber + 1) % this.animation.frames.length;
                this.frame = this.animation.frames[this.frameNumber];
                this.timer = 0;

                if (this.frameNumber === 0 && this.onEnd) {
                    this.onEnd();
                }
            }
        }
    }
}