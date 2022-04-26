export default class DisplayObject {
    constructor(props = {}) {
        this.visible = props.visible ?? true;
        this.x = props.x ?? 0;
        this.y = props.y ?? 0;
        this.width = props.width ?? 0;
        this.height = props.height ?? 0;
        this.debug = props.debug ?? false;
    }

    draw(context) {
        if (this.debug) {
            context.beginPath();
            context.rect(this.x, this.y, this.width, this.height);
            context.fillStyle = 'rgba(0, 255, 0, 0.3)';
            context.fill();

            context.beginPath();
            context.rect(this.x, this.y, this.width, this.height);
            context.lineWidth = 2;
            context.strokeStyle = 'green';
            context.stroke();

            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.x + this.width, this.y + this.height);
            context.stroke();
        }
    }

    update() {

    }
}