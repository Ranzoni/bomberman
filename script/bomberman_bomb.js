let maxQtBombs = 1;

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

        bomb.style['opacity'] = 1;
        bomb.src = `./img/bombs/01/bomb_0${counterImgAnimation}.png`;
    }, 250);
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

    setTimeout(() => {
        clearInterval(bombAnimation);
        document.getElementById('game-board').removeChild(bombCreated);
    }, 3000);

    document.getElementById('game-board').appendChild(bombCreated);
}

document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space') {
        return;
    }

    putBomb();
});