import Game from './Game.js';
import { loadImage, loadJSON } from './Loader.js';
import Cinematic from './Cinematic.js';
import Sprite from './Sprite.js';
import { getRandomFrom, haveCollision } from './Additional.js';
import DisplayObject from './DisplayObject.js';

const scale = 2.3;
let points = 0;
let blueGhostsTimeout;

const main = async () => {
    const game = new Game({
        width: 515.2,
        height: 570,
        background: 'black'
    })

    document.body.append(game.canvas)

    const image = await loadImage('/sets/spritesheet.png');
    const atlas = await loadJSON('/sets/atlas.json');

    const maze = new Sprite({
        image,
        x: 0,
        y: 0,
        width: atlas.maze.width * scale,
        height: atlas.maze.height * scale,
        frame: atlas.maze
    })

    let foods = atlas.maze.foods
        .map((food) => new Sprite({
            image,
            x: food.x * scale,
            y: food.y * scale,
            width: food.width * scale,
            height: food.height * scale,
            frame: atlas.food,
        }));

    const pacman = new Cinematic({
        image,
        x: atlas.position.pacman.x * scale,
        y: atlas.position.pacman.y * scale,
        width: 13 * scale,
        height: 13 * scale,
        animations: atlas.pacman,
        speedX: 2,
        debug: false
    })

    pacman.start('right');

    const ghosts = ['red', 'pink', 'turquoise', 'banana']
        .map((color) => {
            const ghost = new Cinematic({
                image,
                x: atlas.position[color].x * scale,
                y: atlas.position[color].y * scale,
                width: 14 * scale,
                height: 14 * scale,
                animations: atlas[`${color}Ghost`],
                debug: false
            })

            ghost.start(atlas.position[color].direction)
            ghost.nextDirection = atlas.position[color].direction;
            ghost.isBlue = false;

            return ghost
        })

    const walls = atlas.maze.walls.map((wall) => new DisplayObject({
        x: wall.x * scale,
        y: wall.y * scale,
        width: wall.width * scale,
        height: wall.height * scale,
        debug: false
    }))

    const leftPortal = new DisplayObject({
        x: atlas.position.leftPortal.x * scale,
        y: atlas.position.leftPortal.y * scale,
        width: atlas.position.leftPortal.width * scale,
        height: atlas.position.leftPortal.height * scale,
        debug: false
    })

    const rightPortal = new DisplayObject({
        x: atlas.position.rightPortal.x * scale,
        y: atlas.position.rightPortal.y * scale,
        width: atlas.position.rightPortal.width * scale,
        height: atlas.position.rightPortal.height * scale,
        debug: false
    })

    const tablets = atlas.position.tablets
        .map((tablet) => new Sprite({
            image,
            x: tablet.x * scale,
            y: tablet.y * scale,
            width: tablet.width * scale,
            height: tablet.height * scale,
            frame: atlas.tablet
        }))

    game.stage.add(maze);
    game.stage.add(pacman);
    game.stage.add(leftPortal);
    game.stage.add(rightPortal);
    foods.forEach((food) => game.stage.add(food))
    ghosts.forEach((ghost) => game.stage.add(ghost))
    walls.forEach((wall) => game.stage.add(wall))
    tablets.forEach((tablet) => game.stage.add(tablet))

    game.update = () => {
        if (game.gameOver) {
            const title = document.querySelector('#title');
            title.textContent = `Игра окончена`;
            setTimeout(() => document.location.reload(), 5000)

            if (!game.isStartedTimer) {
                game.startTimer((timer) => {
                    const textTimer = document.querySelector('#timer');
                    textTimer.textContent = `(${timer}s)`
                }, 5)
            }
        } else if (game.gameWin) {
            const title = document.querySelector('#title');
            title.textContent = `Вы победили`;
            setTimeout(() => document.location.reload(), 10000)

            if (!game.isStartedTimer) {
                game.startTimer((timer) => {
                    const textTimer = document.querySelector('#timer');
                    textTimer.textContent = `(${timer}s)`
                }, 10)
            }
        }

        const textPoints = document.querySelector('#points');
        textPoints.textContent = `${points} Очков`

        // Проверка съеденной еды
        const eated = [];

        for (const food of foods) {
            if (haveCollision(pacman, food)) {
                eated.push(food)
                points += 100;
                game.stage.remove(food)
            }
        }

        foods = foods.filter((food) => !eated.includes(food));

        // Проверка направления движения
        changeDirection(pacman)
        ghosts.forEach(changeDirection)

        // Проверка столкновения пакмана со стеной
        const wall = getWallCollision(pacman.getNextPosition());

        if (wall) {
            pacman.start(`wait${pacman.animation.name}`)
            pacman.speedX = 0;
            pacman.speedY = 0;
        }

        if (haveCollision(pacman, leftPortal)) {
            pacman.x = atlas.position.rightPortal.x * scale - pacman.width;
        }

        if (haveCollision(pacman, rightPortal)) {
            pacman.x = atlas.position.leftPortal.x * scale + pacman.width;
        }

        // Проверка столкновения призраков со стеной
        for (const ghost of ghosts) {
            if (!ghost.play) return;

            if (haveCollision(ghost, leftPortal)) {
                ghost.nextDirection = 'right';
                ghost.speedX = 2;
            }

            if (haveCollision(ghost, rightPortal)) {
                ghost.nextDirection = 'left';
                ghost.speedX = -2;
            }

            const wall = getWallCollision(ghost.getNextPosition());

            if (wall) {
                ghost.speedX = 0;
                ghost.speedY = 0;
            }

            if ((ghost.speedX === 0 && ghost.speedY === 0) || Math.random() > 0.95) {
                switch (ghost.animation.name) {
                    case 'up':
                        ghost.nextDirection = getRandomFrom('left', 'right')
                        break;

                    case 'down':
                        ghost.nextDirection = getRandomFrom('left', 'right')
                        break;

                    case 'left':
                        ghost.nextDirection = getRandomFrom('up', 'down')
                        break;

                    case 'right':
                        ghost.nextDirection = getRandomFrom('up', 'down')
                        break;

                    default:
                        break;
                }
            }

            if (pacman.play && ghost.play && haveCollision(pacman, ghost)) {
                console.log('touch');
                if (ghost.isBlue) {
                    points += 500;
                    ghost.play = false;
                    ghost.speedX = 0;
                    ghost.speedY = 0;
                    game.stage.remove(ghost);
                    ghosts.splice(ghosts.indexOf(ghost), 1)
                    if (ghosts.length === 0) game.gameWin = true;
                } else {
                    game.gameOver = true;
                    pacman.speedY = 0;
                    pacman.speedX = 0;
                    pacman.start('die', {
                        onEnd() {
                            pacman.play = false;
                            pacman.stop();
                            game.stage.remove(pacman)
                        }
                    })
                }
            }
        }

        //Поедание таблеток
        for (let i = 0; i < tablets.length; i++) {
            const tablet = tablets[i];

            if (haveCollision(pacman, tablet)) {
                if (blueGhostsTimeout) {
                    clearTimeout(blueGhostsTimeout);
                    tablets.splice(i, 1);
                    game.stage.remove(tablet)

                    blueGhostsTimeout = setTimeout(() => {
                        ghosts.forEach((ghost) => {
                            ghost.animations = ghost.originalColor;
                            ghost.isBlue = false;
                            ghost.start(ghost.animation.name);
                            blueGhostsTimeout = null;
                        })
                    }, 8000)

                    break;
                }

                tablets.splice(i, 1);
                game.stage.remove(tablet)

                ghosts.forEach((ghost) => {
                    ghost.originalColor = ghost.animations;
                    ghost.animations = atlas.blueGhost;
                    ghost.isBlue = true;
                    ghost.start(ghost.animation.name)
                })

                blueGhostsTimeout = setTimeout(() => {
                    ghosts.forEach((ghost) => {
                        ghost.animations = ghost.originalColor;
                        ghost.isBlue = false;
                        ghost.start(ghost.animation.name);
                        blueGhostsTimeout = null;
                    })
                }, 8000)

                break;
            }
        }
    }

    document.addEventListener('keydown', (event) => {
        if (!pacman.play) return;

        switch (event.code) {
            case 'KeyW':
                pacman.nextDirection = 'up'
                break;

            case 'KeyD':
                pacman.nextDirection = 'right'
                break;

            case 'KeyS':
                pacman.nextDirection = 'down'
                break;

            case 'KeyA':
                pacman.nextDirection = 'left'
                break;

            default: break;
        }
    })

    const getWallCollision = (object) => {
        for (const wall of walls) {
            if (haveCollision(wall, object)) return wall
        }

        return null
    }

    const changeDirection = (sprite) => {
        switch (sprite.nextDirection) {
            case 'up':
                sprite.y -= 10;

                if (!getWallCollision(sprite)) {
                    sprite.nextDirection = null;
                    sprite.start('up')
                    sprite.speedX = 0;
                    sprite.speedY = -2;
                }

                sprite.y += 10;

                break;

            case 'down':
                sprite.y += 10;

                if (!getWallCollision(sprite)) {
                    sprite.nextDirection = null;
                    sprite.start('down')
                    sprite.speedX = 0;
                    sprite.speedY = 2;
                }

                sprite.y -= 10;

                break;

            case 'left':
                sprite.x -= 10;

                if (!getWallCollision(sprite)) {
                    sprite.nextDirection = null;
                    sprite.start('left')
                    sprite.speedX = -2;
                    sprite.speedY = 0;
                }

                sprite.x += 10;

                break;

            case 'right':
                sprite.x += 10;

                if (!getWallCollision(sprite)) {
                    sprite.nextDirection = null;
                    sprite.start('right')
                    sprite.speedX = 2;
                    sprite.speedY = 0;
                }

                sprite.x -= 10;

                break;

            default:
                break;
        }
    }
};

main();