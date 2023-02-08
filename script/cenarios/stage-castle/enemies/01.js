const UP_DIRECTION = 1;
const DOWN_DIRECTION = 2;
const LEFT_DIRECTION = 3;
const RIGHT_DIRECTION = 4;

const VELOCITY_ENEMY_01 = 27;

const LIST_DIRECTIONS = [UP_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, RIGHT_DIRECTION];

let loopCastleEnemy01Image = null;
let loopCastleEnemy01Position = null;

function animateCastleEnemy01(direction, enemy, legDirection) {
    let startImgName = '';
    if (direction === UP_DIRECTION)  {
        startImgName = 'back';
    } else if (direction === DOWN_DIRECTION)  {
        startImgName = 'profile';
    } else if (direction === RIGHT_DIRECTION)  {
        startImgName = 'right_side';
    } else if (direction === LEFT_DIRECTION)  {
        startImgName = 'left_side';
    } else {
        return;
    }

    legDirection = LEG_LEFT;
    enemy.src = `./img/stages/castle/enemies/01/${startImgName}_left.png`;
    loopCastleEnemy01Image = setInterval(() => {
        if (legDirection === LEG_LEFT)  {
            enemy.src = `./img/stages/castle/enemies/01/${startImgName}_right.png`;
            legDirection = LEG_RIGHT;
        } else {
            enemy.src = `./img/stages/castle/enemies/01/${startImgName}_left.png`;
            legDirection = LEG_LEFT;
        }
    }, 250);
}

function canMoveCastleEnemy01(direction, enemy) {
    const enemyTop = +window.getComputedStyle(enemy).top.replace('px', '');
    const enemyLeft = +window.getComputedStyle(enemy).left.replace('px', '');
    const obstacles = document.getElementsByClassName('obstacle');

    let functionReturn = true;

    Array.prototype.forEach.call(obstacles, obstacle => {
        const obstacleTop = +window.getComputedStyle(obstacle).top.replace('px', '');
        const obstacleLeft = +window.getComputedStyle(obstacle).left.replace('px', '');

        if (direction === UP_DIRECTION || direction === DOWN_DIRECTION) {
            if ((enemyLeft + enemy.width) <= (obstacleLeft + 4) || enemyLeft >= (obstacleLeft + obstacle.width - 4)) {
                return;
            }

            let nextTopPosition = direction === UP_DIRECTION ? enemyTop - QT_PIXELS_MOVE : enemyTop + QT_PIXELS_MOVE;

            if ((nextTopPosition + enemy.height) > (obstacleTop + 2) && nextTopPosition <= obstacleTop) {
                functionReturn = false;
                return false;
            }
        }
            
        if (direction === RIGHT_DIRECTION || direction === LEFT_DIRECTION) {
            if ((enemyTop + enemy.height) <= (obstacleTop + 2) || enemyTop > obstacleTop) {
                return;
            }
            
            let nextLeftPosition = (direction === RIGHT_DIRECTION) ? enemyLeft + QT_PIXELS_MOVE : enemyLeft - QT_PIXELS_MOVE;

            if ((nextLeftPosition + enemy.width) > (obstacleLeft + 4) && nextLeftPosition <= (obstacleLeft + obstacle.width - 4)) {
                functionReturn = false;
                return false;
            }
        }
    });

    return functionReturn;
}

function alterCastleEnemy01Position(direction, enemy) {
    let pixelsToMove = QT_PIXELS_MOVE;
    let property = null;
    if (direction === UP_DIRECTION || direction === DOWN_DIRECTION)  {
        property = 'top';

        if (direction === UP_DIRECTION) {
            pixelsToMove *= -1;
        }
    } else if (direction === RIGHT_DIRECTION || direction === LEFT_DIRECTION)  {
        property = 'left';

        if (direction === LEFT_DIRECTION) {
            pixelsToMove *= -1;
        }
    } else {
        return;
    }

    let enemyPosition = +window.getComputedStyle(enemy)[property].replace('px', '');
    enemy.style[property] = `${enemyPosition + pixelsToMove}px`;
    loopCastleEnemy01Position = setInterval(() => {
        if (!canMoveCastleEnemy01(direction, enemy)) {
            clearInterval(loopCastleEnemy01Position);
            return;
        }

        enemyPosition = +window.getComputedStyle(enemy)[property].replace('px', '');
        enemy.style[property] = `${enemyPosition + pixelsToMove}px`;
    }, VELOCITY_ENEMY_01);
}

function moveCastleEnemy01() {
    let canMove = false;
    let directionToMove = null;

    for (var i = 0; i <= 3; i++) {
        let directionTest = LIST_DIRECTIONS[i];
        if (canMoveCastleEnemy01(directionTest)) {
            canMove = true;
            directionToMove = directionTest;
            break;
        }
    }

    if (!!canMove) {
        animateBomberman(directionToMove);
        alterBombermanPosition(directionToMove);
    }
}

function enemy_01_01() {
    let canMove = false;
    let directionToMove = null;
    let lastDirection = null;

    const enemy_01_01Object = document.getElementById('enemy_01_01');

    setInterval(() => {
        let teste = !!canMoveCastleEnemy01(lastDirection, enemy_01_01Object);
        if (!!lastDirection && !!canMoveCastleEnemy01(lastDirection, enemy_01_01Object)) {
            return;
        }

        clearInterval(loopCastleEnemy01Position);
        clearInterval(loopCastleEnemy01Image);

        for (var i = 0; i <= 3; i++) {
            let directionTest = LIST_DIRECTIONS[i];
            if (!!canMoveCastleEnemy01(directionTest, enemy_01_01Object)) {
                canMove = true;
                directionToMove = directionTest;
                break;
            }
        }

        if (!!canMove) {
            let legDirection = LEG_LEFT;
            animateCastleEnemy01(directionToMove, enemy_01_01Object, legDirection);
            alterCastleEnemy01Position(directionToMove, enemy_01_01Object);
        }

        lastDirection = directionToMove;
    }, 200);
};

enemy_01_01();

// const enemy01_02 = setInterval(() => {
//     moveCastleEnemy01();
// }, 200);

// const enemy01_03 = setInterval(() => {
//     moveCastleEnemy01();
// }, 200);