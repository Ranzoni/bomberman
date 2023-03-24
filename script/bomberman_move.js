const QT_PIXELS_MOVE = 2;

const MARGIN_TO_MOVE = 4;

const LEG_LEFT = 0;
const LEG_RIGHT = 1;

const KEY_ARROW_UP = 'ArrowUp';
const KEY_ARROW_DOWN = 'ArrowDown';
const KEY_ARROW_RIGHT = 'ArrowRight';
const KEY_ARROW_LEFT = 'ArrowLeft';

const MOVE_KEYS = [KEY_ARROW_UP, KEY_ARROW_DOWN, KEY_ARROW_RIGHT, KEY_ARROW_LEFT];

let onMove = false;
let lastKeyDirection = null;

let bombermanLegDirection = LEG_LEFT;

let loopBombermanImage = null;
let loopBombermanPosition = null;
let velocityBombermanMove = 15;

function animateBomberman(keyDown) {
    let startImgName = '';
    if (keyDown === KEY_ARROW_UP)  {
        startImgName = 'back';
    } else if (keyDown === KEY_ARROW_DOWN)  {
        startImgName = 'profile';
    } else if (keyDown === KEY_ARROW_RIGHT)  {
        startImgName = 'right_side';
    } else if (keyDown === KEY_ARROW_LEFT)  {
        startImgName = 'left_side';
    } else {
        return;
    }

    bombermanLegDirection = LEG_LEFT;
    bomberman.src = `./img/bomberman/move/${startImgName}_left_leg.png`;
    loopBombermanImage = setInterval(() => {
        if (bombermanLegDirection === LEG_LEFT)  {
            bomberman.src = `./img/bomberman/move/${startImgName}_right_leg.png`;
            bombermanLegDirection = LEG_RIGHT;
        } else {
            bomberman.src = `./img/bomberman/move/${startImgName}_left_leg.png`;
            bombermanLegDirection = LEG_LEFT;
        }
    }, 200);
}

function nextBombermanPosition(keyDown) {
    const bomberman = document.getElementById('bomberman');
    const bombermanBottom = +window.getComputedStyle(bomberman).bottom.replace('px', '');
    const bombermanLeft = +window.getComputedStyle(bomberman).left.replace('px', '');
    const obstacles = document.getElementsByClassName('obstacle');

    let nextBottomPosition = bombermanBottom;
    let nextLeftPosition = bombermanLeft;
    if (keyDown === KEY_ARROW_UP || keyDown === KEY_ARROW_DOWN) {
        nextBottomPosition = keyDown === KEY_ARROW_UP ? bombermanBottom + QT_PIXELS_MOVE : bombermanBottom - QT_PIXELS_MOVE;
        nextLeftPosition = (bombermanLeft % 32 === 0) ? bombermanLeft : Math.round(bombermanLeft / 32) * 32;
    } else {
        nextLeftPosition = (keyDown === KEY_ARROW_RIGHT) ? bombermanLeft + QT_PIXELS_MOVE : bombermanLeft - QT_PIXELS_MOVE;
        nextBottomPosition = (bombermanBottom % 32 === 0) ? bombermanBottom : Math.round(bombermanBottom / 32) * 32;
    }

    let functionReturn = [nextBottomPosition, nextLeftPosition];

    Array.prototype.forEach.call(obstacles, obstacle => {
        const obstacleBottom = +window.getComputedStyle(obstacle).bottom.replace('px', '');
        const obstacleLeft = +window.getComputedStyle(obstacle).left.replace('px', '');
        
        if (keyDown === KEY_ARROW_UP || keyDown === KEY_ARROW_DOWN) {
            if (nextLeftPosition !== obstacleLeft) {
                return;
            }

            if (keyDown === KEY_ARROW_UP) {
                if (bombermanBottom + 30 >= obstacleBottom && bombermanBottom + 30 < (obstacleBottom + obstacle.height)) {
                    return;
                }
            } else {
                if (bombermanBottom >= obstacleBottom && bombermanBottom < (obstacleBottom + obstacle.height)) {
                    return;
                }
            }

            if (keyDown === KEY_ARROW_UP) {
                if (nextBottomPosition + 30 >= obstacleBottom && nextBottomPosition + 30 < (obstacleBottom + obstacle.height)) {
                    functionReturn = [];
                    return false;
                }
            } else {
                if (nextBottomPosition >= obstacleBottom && nextBottomPosition < (obstacleBottom + obstacle.height)) {
                    functionReturn = [];
                    return false;
                }
            }

        }
        
        if (keyDown === KEY_ARROW_RIGHT || keyDown === KEY_ARROW_LEFT) {
            if (functionReturn[0] !== obstacleBottom) {
                return;
            }

            if (keyDown === KEY_ARROW_RIGHT) {
                if (bombermanLeft + bomberman.width > obstacleLeft && bombermanLeft + bomberman.width <= (obstacleLeft + obstacle.width)) {
                    return;
                }
            } else {
                if (bombermanLeft >= obstacleLeft && bombermanLeft < (obstacleLeft + obstacle.width)) {
                    return;
                }
            }

            if (keyDown === KEY_ARROW_RIGHT) {
                if (nextLeftPosition + bomberman.width > obstacleLeft && nextLeftPosition + bomberman.width <= (obstacleLeft + obstacle.width)) {
                    functionReturn = [];
                    return false;
                }
            } else {
                if (nextLeftPosition >= obstacleLeft && nextLeftPosition < (obstacleLeft + obstacle.width)) {
                    functionReturn = [];
                    return false;
                }
            }
        }
    });

    return functionReturn;
}

function alterBombermanPosition(keyDown) {
    const bomberman = document.getElementById('bomberman');
    let pixelsToMove = QT_PIXELS_MOVE;
    let property = null;
    let otherProperty = null;
    if (keyDown === KEY_ARROW_UP || keyDown === KEY_ARROW_DOWN)  {
        property = 'top';
        otherProperty = 'left';

        if (keyDown === KEY_ARROW_UP) {
            pixelsToMove *= -1;
        }
    } else if (keyDown === KEY_ARROW_RIGHT || keyDown === KEY_ARROW_LEFT)  {
        property = 'left';
        otherProperty = 'top';

        if (keyDown === KEY_ARROW_LEFT) {
            pixelsToMove *= -1;
        }
    } else {
        return;
    }

    loopBombermanPosition = setInterval(() => {
        let bombermanNewPosition = nextBombermanPosition(keyDown);
        if (!bombermanNewPosition) {
            clearInterval(loopBombermanPosition);
            return;
        }

        bomberman.style.bottom = `${bombermanNewPosition[0]}px`;
        bomberman.style['left'] = `${bombermanNewPosition[1]}px`;
    }, velocityBombermanMove);
}

function moveBomberman(keyDown) {
    if (!!onMove && lastKeyDirection === keyDown) {
        return;
    } else if (!!onMove && lastKeyDirection !== keyDown) {
        clearBombermanIntervals();
    }

    animateBomberman(keyDown);
    alterBombermanPosition(keyDown);

    onMove = true;
    lastKeyDirection = keyDown;
}

function stopBomberman(keyDown) {
    if (keyDown !== lastKeyDirection) {
        return;
    }
    
    clearBombermanIntervals();
    onMove = false;
    lastKeyDirection = null;

    if (keyDown === KEY_ARROW_UP)  {
        bomberman.src = './img/bomberman/move/back_stopped.png';
    } else if (keyDown === KEY_ARROW_DOWN)  {
        bomberman.src = './img/bomberman/move/profile_stopped.png';
    } else if (keyDown === KEY_ARROW_RIGHT)  {
        bomberman.src = './img/bomberman/move/right_side_stopped.png';
    } else if (keyDown === KEY_ARROW_LEFT)  {
        bomberman.src = './img/bomberman/move/left_side_stopped.png';
    }
}

function clearBombermanIntervals() {
    clearInterval(loopBombermanImage);
    clearInterval(loopBombermanPosition);
}

function bombermanIsDead() {
    return document.getElementsByClassName('dead').length > 0;
}

document.addEventListener('keydown', (e) => {
    let isMoveKey = MOVE_KEYS.find(element => element === e.key);

    if (!!bombermanIsDead() || !isMoveKey) {
        return;
    }
    
    moveBomberman(e.key);
});

document.addEventListener('keyup', (e) => {
    let isMoveKey = MOVE_KEYS.find(element => element === e.key);

    if (!!bombermanIsDead() || !isMoveKey) {
        return;
    }

    stopBomberman(e.key);
});

function bombermanDie(bomberman) {
    const bombermanBottom = +window.getComputedStyle(bomberman).bottom.replace('px', '');
    const bombermanLeft = +window.getComputedStyle(bomberman).left.replace('px', '');
    const explosions = document.getElementsByClassName('explosion');
    let functionReturn = false;

    Array.prototype.forEach.call(explosions, explosion => {
        if (explosion.style['opacity'] !== '1') {
            return;
        }

        const explosionTop = +window.getComputedStyle(explosion).top.replace('px', '');
        const explosionLeft = +window.getComputedStyle(explosion).left.replace('px', '');

        if (((bombermanBottom + bomberman.height) > (explosionTop + 2) && bombermanBottom <= explosionTop) && ((bombermanLeft + bomberman.width) > (explosionLeft + 4) && bombermanLeft <= (explosionLeft + explosion.width - 4))) {
            functionReturn = true;
            return false;
        }
    });

    const enemies = document.getElementsByClassName('enemy');
    Array.prototype.forEach.call(enemies, enemy => {
        const enemyBottom = +window.getComputedStyle(enemy).bottom.replace('px', '');
        const enemyLeft = +window.getComputedStyle(enemy).left.replace('px', '');

        if (Math.abs(bombermanBottom - enemyBottom) <= 16 && ((bombermanLeft + bomberman.width) > (enemyLeft + 4) && bombermanLeft <= (enemyLeft + enemy.width - 4))) {
            functionReturn = true;
            return false;
        }
    });

    return functionReturn;
}

function animateBombermanDeath(bomberman) {
    let animationCounter = 1;
    let animationBombermanDeath = setInterval(() => {
        bomberman.style['width'] = '28px';
        bomberman.src = `./img/bomberman/lose/move_${String(animationCounter).padStart(2, '0')}.png`;
        bomberman.setAttribute('class', 'dead');
        
        if (++animationCounter > 10) {
            clearInterval(animationBombermanDeath);
            return;
        }
    }, 200);
}

let checkIfBombermanIsDead = setInterval(() => {
    const bomberman = document.getElementById('bomberman');

    if (!bombermanDie(bomberman)) {
        return;
    }
    
    clearInterval(loopBombermanImage);
    clearInterval(loopBombermanPosition);
    clearInterval(checkIfBombermanIsDead);
    
    animateBombermanDeath(bomberman);
}, 10);