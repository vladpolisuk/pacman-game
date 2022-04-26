import Group from "./Group.js";

export default class Game {
    constructor(props = {}) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.stage = new Group();
        this.gameWin = false;
        this.gameOver = false;
        this.timer = 0;
        this.isStartedTimer = false;
        this.canvas.width = props.width ?? 50;
        this.canvas.height = props.height ?? 50;
        this.background = props.background ?? 'black';
        this.previoslyTimestamp = 0;
        requestAnimationFrame((timestamp) => this.render(timestamp));
    }

    update() { }

    clearCanvas() {
        this.canvas.width = this.canvas.width;
    }

    drawBackground() {
        this.context.beginPath();
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.background;
        this.context.fill();
    }

    render(timestamp) {
        requestAnimationFrame((timestamp) => this.render(timestamp));
        const delta = timestamp - this.previoslyTimestamp;
        this.previoslyTimestamp = timestamp;
        this.update();
        this.stage.update(delta);
        this.clearCanvas();
        this.drawBackground()
        this.stage.draw(this.context);
    }

    startTimer(action, endTime) {
        this.timer = endTime;
        this.isStartedTimer = true;

        setInterval(() => {
            action(this.timer)
            this.timer -= 1;
        }, 1000);
    }
}