const QT_PIXELS_MOVE = 2;

const LEG_LEFT = 0;
const LEG_RIGHT = 1;

const KEY_ARROW_UP = 'ArrowUp';
const KEY_ARROW_DOWN = 'ArrowDown';
const KEY_ARROW_RIGHT = 'ArrowRight';
const KEY_ARROW_LEFT = 'ArrowLeft';

let onMove = false;
let lastKeyDirection = null;

let legDirection = LEG_LEFT;

let loopImage = null;
let loopPosition = null;
let velocityMove = 15;

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

    legDirection = LEG_LEFT;
    bomberman.src = `./img/bomberman/move/${startImgName}_left_leg.png`;
    loopImage = setInterval(() => {
        if (legDirection === LEG_LEFT)  {
            bomberman.src = `./img/bomberman/move/${startImgName}_right_leg.png`;
            legDirection = LEG_RIGHT;
        } else {
            bomberman.src = `./img/bomberman/move/${startImgName}_left_leg.png`;
            legDirection = LEG_LEFT;
        }
    }, 200);
}

function alterBombermanPosition(keyDown) {
    const bomberman = document.getElementById('bomberman');
    let pixelsToMove = QT_PIXELS_MOVE;
    let property = null;
    if (keyDown === KEY_ARROW_UP || keyDown === KEY_ARROW_DOWN)  {
        property = 'top';

        if (keyDown === KEY_ARROW_UP) {
            pixelsToMove *= -1;
        }
    } else if (keyDown === KEY_ARROW_RIGHT || keyDown === KEY_ARROW_LEFT)  {
        property = 'left';

        if (keyDown === KEY_ARROW_LEFT) {
            pixelsToMove *= -1;
        }
    } else {
        return;
    }

    let positionBomberman = +window.getComputedStyle(bomberman)[property].replace('px', '');
    bomberman.style[property] = `${positionBomberman + pixelsToMove}px`;
    loopPosition = setInterval(() => {
        positionBomberman = +window.getComputedStyle(bomberman)[property].replace('px', '');
        bomberman.style[property] = `${positionBomberman + pixelsToMove}px`;
    }, velocityMove);
}

function moveBomberman(keyDown) {
    if (!!onMove && lastKeyDirection === keyDown) {
        return;
    } else if (!!onMove && lastKeyDirection !== keyDown) {
        clearIntervals();
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
    
    clearIntervals();
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

function clearIntervals() {
    clearInterval(loopImage);
    clearInterval(loopPosition);
}

document.addEventListener('keydown', (e) => {
    moveBomberman(e.key);
});

document.addEventListener('keyup', (e) => {
    stopBomberman(e.key);
});