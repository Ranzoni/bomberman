let maxQtBombs = 1;
let bombSize = 0;

const LIST_DESCRIPTION_DIRECTION = ['left', 'up', 'right', 'down'];

function createBomb() {
    const bombermanComputed = window.getComputedStyle(bomberman);
    let bomb = document.createElement('img');
    bomb.setAttribute('class', 'bomb obstacle');
    bomb.style['opacity'] = 0;
    bomb.src = './img/bombs/01/bomb_01.png';

    let bottomInNumber = +bombermanComputed.bottom.replace('px', '');
    bomb.style['bottom'] = (bottomInNumber % 32 === 0) ? bombermanComputed.bottom : `${Math.round(bottomInNumber / 32) * 32}px`;

    let leftInNumber = +bombermanComputed.left.replace('px', '');
    bomb.style['left'] = (leftInNumber % 32 === 0) ? bombermanComputed.left : `${Math.round(leftInNumber / 32) * 32}px`;

    return bomb;
}

function existsObstacle(leftPosition, bottomPosition) {
    const obstaclesToEnemies = document.getElementsByClassName('obstacle');
    let functionReturn = false;

    Array.prototype.forEach.call(obstaclesToEnemies, obstacle => {
        const obstacleBottom = +window.getComputedStyle(obstacle).bottom.replace('px', '');
        const obstacleLeft = +window.getComputedStyle(obstacle).left.replace('px', '');

        if (obstacleBottom === bottomPosition && obstacleLeft === leftPosition) {
            functionReturn = true;
            return;
        }
    });

    return functionReturn;
}

function createExplosion(bomb) {
    let arrayExplosions = [];
    let explosion = document.createElement('img');
    explosion.setAttribute('class', 'bomb');
    explosion.style['opacity'] = 0;
    explosion.src = './img/bombs/01/explosion_central_01.png';
    explosion.style['bottom'] = bomb.style['bottom'];
    explosion.style['left'] = bomb.style['left'];

    arrayExplosions.push(explosion);

    for (let i = 1; i <= 4; i++) {
        let direction = i % 2 === 0 ? 'vertical' : 'horizontal';
        let bottomExplosion = +explosion.style['bottom'].replace('px', '');
        let leftExplosion = +explosion.style['left'].replace('px', '');
        let sizeLeftExplosion = 32;
        let sizeBottomExplosion = 32;

        if (i === 1) {
            sizeLeftExplosion *= -1;
        } else if (i === 4) {
            sizeBottomExplosion *= -1;
        }

        for (let j = 1; j <= bombSize; j++) {
            if (i === 1 || i === 3) {
                leftExplosion += sizeLeftExplosion;
            } else {
                bottomExplosion += sizeBottomExplosion;
            }
            
            if (existsObstacle(leftExplosion, bottomExplosion)) {
                return;
            }

            let trailExplosion = document.createElement('img');
            trailExplosion.setAttribute('class', 'bomb');
            trailExplosion.style['opacity'] = 0;
            trailExplosion.src = `./img/bombs/01/explosion_trail_${direction}_01.png`;
            trailExplosion.style['bottom'] = `${bottomExplosion}px`;
            trailExplosion.style['left'] = `${leftExplosion}px`;
            arrayExplosions.push(trailExplosion);
        }

        if (i === 1 || i === 3) {
            leftExplosion += sizeLeftExplosion;
        } else {
            bottomExplosion += sizeBottomExplosion;
        }

        if (existsObstacle(leftExplosion, bottomExplosion)) {
            continue;
        }

        let tipExplosion = document.createElement('img');
        tipExplosion.setAttribute('class', 'bomb');
        tipExplosion.style['opacity'] = 0;
        tipExplosion.src = `./img/bombs/01/explosion_tip_${LIST_DESCRIPTION_DIRECTION[i-1]}_01.png`;
        tipExplosion.style['bottom'] = `${bottomExplosion}px`;
        tipExplosion.style['left'] = `${leftExplosion}px`;
        arrayExplosions.push(tipExplosion);
    }

    return arrayExplosions;
}

function animateBomb(bomb) {
    let counterImgAnimation = 1;
    let toGrow = true;
    
    bomb.style['opacity'] = 1;
    bomb.src = `./img/bombs/01/bomb_0${counterImgAnimation}.png`;

    return setInterval(() => {
        if (counterImgAnimation === 3 && !!toGrow) {
            toGrow = false;
        } else if (counterImgAnimation === 1 && !toGrow) {
            toGrow = true;
        }

        !!toGrow ? counterImgAnimation++ : counterImgAnimation--;

        bomb.src = `./img/bombs/01/bomb_0${counterImgAnimation}.png`;
    }, 250);
}

function animateExplosion(explosion) {
    let counterImgAnimation = 1;
        
    explosion.style['opacity'] = 1;
    explosion.src = explosion.src.substr(0, explosion.src.length-5) + `${counterImgAnimation}.png`;

    let explosionAnimation = setInterval(() => {
        counterImgAnimation++;

        explosion.src = explosion.src.substr(0, explosion.src.length-5) + `${counterImgAnimation}.png`;

        if (counterImgAnimation >= 5) {
            clearInterval(explosionAnimation);
            document.getElementById('game-board').removeChild(explosion);
        }
    }, 100);
}

function canPutBomb() {
    const bombs = document.getElementsByClassName('bomb');
    if (bombs.length >= maxQtBombs) {
        return;
    }

    const bombermanComputed = window.getComputedStyle(bomberman);
    let functionReturn = true;

    Array.prototype.forEach.call(bombs, bomb => {
        let bottomNextBomb;
        let leftNextBomb;

        let bottomInNumber = +bombermanComputed.bottom.replace('px', '');
        bottomNextBomb = (bottomInNumber % 32 === 0) ? bombermanComputed.bottom : Math.round(bottomInNumber / 32) * 32;

        let leftInNumber = +bombermanComputed.left.replace('px', '');
        leftNextBomb = (leftInNumber % 32 === 0) ? +bombermanComputed.left.replace('px', '') : Math.round(leftInNumber / 32) * 32;
        
        let bottomBomb = +bomb.style['bottom'].replace('px', '');
        let leftBomb = +bomb.style['left'].replace('px', '');

        if (bottomBomb === bottomNextBomb && leftBomb === leftNextBomb) {
            functionReturn = false;
            return false;
        }
    });

    return functionReturn;
}

function putBomb() {
    if (!canPutBomb()) {
        return;
    }

    let bombCreated = createBomb();
    
    let bombAnimation = animateBomb(bombCreated);
    
    document.getElementById('game-board').appendChild(bombCreated);
    
    let listExplosionCreated = createExplosion(bombCreated);
    listExplosionCreated.forEach(explosionCreated => {        
        document.getElementById('game-board').appendChild(explosionCreated);
        
        setTimeout(() => {
            if (!!bombCreated) {
                clearInterval(bombAnimation);
                document.getElementById('game-board').removeChild(bombCreated);
            }
            bombCreated = undefined;
            
            animateExplosion(explosionCreated);
        }, 3000);
    });
}

document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space') {
        return;
    }

    putBomb();
});