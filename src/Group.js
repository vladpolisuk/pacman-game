import DisplayObject from './DisplayObject.js';

export default class Group extends DisplayObject {
    constructor(props = {}) {
        super(props);
        this.container = new Set();
    }

    get items() {
        return Array.from(this.container)
    }

    add(...displayObjects) {
        for (const displayObject of displayObjects) {
            this.container.add(displayObject);
        }
    }

    remove(...displayObjects) {
        for (const displayObject of displayObjects) {
            this.container.delete(displayObject);
        }
    }

    update(delta) {
        this.items.forEach((item) => item.update(delta))
    }

    draw(context) {
        this.items.forEach((item) => item.draw(context))
    }
}