const UP_DIRECTION = 1;
const DOWN_DIRECTION = 2;
const LEFT_DIRECTION = 3;
const RIGHT_DIRECTION = 4;

const TIME_VELOCITY_ENEMY_01 = 27;

const TIME_AIMATION_ENEMY_01 = 250;

const TIME_CHECK_MOVE_ENEMY_01 = 200;

const LIST_DIRECTIONS = [UP_DIRECTION, DOWN_DIRECTION, LEFT_DIRECTION, RIGHT_DIRECTION];

let loopCastleEnemy0101Image = null;
let loopCastleEnemy0101Position = null;

let loopCastleEnemy0102Image = null;
let loopCastleEnemy0102Position = null;

let loopCastleEnemy0103Image = null;
let loopCastleEnemy0103Position = null;

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
    return setInterval(() => {
        if (legDirection === LEG_LEFT)  {
            enemy.src = `./img/stages/castle/enemies/01/${startImgName}_right.png`;
            legDirection = LEG_RIGHT;
        } else {
            enemy.src = `./img/stages/castle/enemies/01/${startImgName}_left.png`;
            legDirection = LEG_LEFT;
        }
    }, TIME_AIMATION_ENEMY_01);
}

function canMoveCastleEnemy01(direction, enemy) {
    const enemyTop = +window.getComputedStyle(enemy).top.replace('px', '');
    const enemyLeft = +window.getComputedStyle(enemy).left.replace('px', '');
    const obstaclesToEnemies = document.getElementsByClassName('obstacle');
    const characters = document.getElementsByClassName('enemy');

    let functionReturn = true;

    Array.prototype.forEach.call(obstaclesToEnemies, obstacle => {
        const obstacleTop = +window.getComputedStyle(obstacle).top.replace('px', '');
        const obstacleLeft = +window.getComputedStyle(obstacle).left.replace('px', '');

        if (direction === UP_DIRECTION || direction === DOWN_DIRECTION) {
            if ((enemyLeft + enemy.width) <= (obstacleLeft) || enemyLeft >= (obstacleLeft + obstacle.width)) {
                return;
            }
                 
            let nextTopPosition = direction === UP_DIRECTION ? enemyTop - QT_PIXELS_MOVE : enemyTop + QT_PIXELS_MOVE;
            
            if ((nextTopPosition + enemy.height + 4) > (obstacleTop) && nextTopPosition - 12 <= obstacleTop) {
                functionReturn = false;
                return false;
            }
        }
            
        if (direction === RIGHT_DIRECTION || direction === LEFT_DIRECTION) {
            if ((enemyTop + enemy.height - 4) <= (obstacleTop) || enemyTop + 12 > obstacleTop) {
                return;
            }
            
            let nextLeftPosition = (direction === RIGHT_DIRECTION) ? enemyLeft + QT_PIXELS_MOVE : enemyLeft - QT_PIXELS_MOVE;

            if ((nextLeftPosition + enemy.width) > (obstacleLeft) && nextLeftPosition <= (obstacleLeft + obstacle.width)) {
                functionReturn = false;
                return false;
            }
        }
    });

    Array.prototype.forEach.call(characters, character => {
        const characterTop = +window.getComputedStyle(character).top.replace('px', '');
        const characterLeft = +window.getComputedStyle(character).left.replace('px', '');
        
        if (character.id === enemy.id) {
            return;
        }

        if (direction === UP_DIRECTION || direction === DOWN_DIRECTION) {
            if (enemyLeft !== characterLeft) {
                return;
            }
            
            let nextTopPosition = direction === UP_DIRECTION ? enemyTop - QT_PIXELS_MOVE : enemyTop + QT_PIXELS_MOVE;
            
            if ((nextTopPosition + enemy.height + 8) > (characterTop) && nextTopPosition - 36 <= characterTop) {
                functionReturn = false;
                return false;
            }
        }
        
        if (direction === RIGHT_DIRECTION || direction === LEFT_DIRECTION) {
            if (enemyTop !== characterTop) {
                return;
            }

            let nextLeftPosition = (direction === RIGHT_DIRECTION) ? enemyLeft + QT_PIXELS_MOVE : enemyLeft - QT_PIXELS_MOVE;

            if ((nextLeftPosition + enemy.width) > (characterLeft) && nextLeftPosition <= (characterLeft + character.width)) {
                functionReturn = false;
                return false;
            }
        }
    });

    return functionReturn;
}

function alterCastleEnemy01Position(direction, enemy, loopCastleEnemy01Position) {
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
    return setInterval(() => {
        if (!canMoveCastleEnemy01(direction, enemy)) {
            clearInterval(loopCastleEnemy01Position);
            return;
        }

        enemyPosition = +window.getComputedStyle(enemy)[property].replace('px', '');
        enemy.style[property] = `${enemyPosition + pixelsToMove}px`;
    }, TIME_VELOCITY_ENEMY_01);
}

function animateEnemyDeath(enemy) {
    enemy.src = './img/stages/castle/enemies/01/dying.png';
    setTimeout(() => {
        enemy.style['opacity'] = '0';
    }, 300);
}

function enemy01Die(enemy) {
    const enemyTop = +window.getComputedStyle(enemy).top.replace('px', '');
    const enemyLeft = +window.getComputedStyle(enemy).left.replace('px', '');
    const explosions = document.getElementsByClassName('explosion');
    let functionReturn = false;

    Array.prototype.forEach.call(explosions, explosion => {
        if (explosion.style['opacity'] !== '1') {
            return;
        }

        const explosionTop = +window.getComputedStyle(explosion).top.replace('px', '');
        const explosionLeft = +window.getComputedStyle(explosion).left.replace('px', '');

        if (((enemyTop + enemy.height + 4) > (explosionTop) && enemyTop - 12 <= explosionTop) && ((enemyLeft + enemy.width) > (explosionLeft) && enemyLeft <= (explosionLeft + explosion.width))) {
            functionReturn = true;
            return false;
        }
    });

    return functionReturn;
}

function enemy_01(id, loopCastleEnemy01Position, loopCastleEnemy01Image) {
    let directionToMove = null;
    let lastDirection = null;
    
    const enemy_01_01Object = document.getElementById(id);
    
    setInterval(() => {
        if (!!bombermanIsDead()) {
            clearInterval(loopCastleEnemy01Position);
            clearInterval(loopCastleEnemy01Image);
            return;
        }

        if (!!lastDirection && !!canMoveCastleEnemy01(lastDirection, enemy_01_01Object)) {
            return;
        }

        clearInterval(loopCastleEnemy01Position);
        clearInterval(loopCastleEnemy01Image);

        let directionTest = null;
        let directionsTested = [];
        let directionsToTest = [];
        do {
            directionsToTest = LIST_DIRECTIONS.filter(direction => {
                return !directionsTested.find(directionTested => direction === directionTested);
            });
            let randomIndex = Math.floor(Math.random() * (directionsToTest.length));
            directionTest = directionsToTest[randomIndex];
            let directionWasTested = directionsTested.find(element => {
                return element === directionTest;
            });

            if (!!directionWasTested) {
                continue;
            }

            directionsTested.push(directionTest);
        } while (!canMoveCastleEnemy01(directionTest, enemy_01_01Object));

        directionToMove = directionTest;
        lastDirection = directionToMove;
        
        loopCastleEnemy01Image = animateCastleEnemy01(directionToMove, enemy_01_01Object, LEG_LEFT);
        loopCastleEnemy01Position = alterCastleEnemy01Position(directionToMove, enemy_01_01Object, loopCastleEnemy01Position);
    }, TIME_CHECK_MOVE_ENEMY_01);

    let checkIfEnemyIsDead = setInterval(() => {    
        if (!enemy01Die(enemy_01_01Object)) {
            return;
        }

        clearInterval(loopCastleEnemy01Image);
        clearInterval(loopCastleEnemy01Position);

        animateEnemyDeath(enemy_01_01Object);
        document.getElementById('game-board').removeChild(enemy_01_01Object);
        
        clearInterval(checkIfEnemyIsDead);
    }, 10);
};

enemy_01('enemy_01_01', loopCastleEnemy0101Position, loopCastleEnemy0101Image);

enemy_01('enemy_01_02', loopCastleEnemy0102Position, loopCastleEnemy0102Image);

enemy_01('enemy_01_03', loopCastleEnemy0103Position, loopCastleEnemy0103Image);