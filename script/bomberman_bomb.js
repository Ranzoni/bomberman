function createBomb() {
    const bombermanComputed = window.getComputedStyle(bomberman);
    let bomb = document.createElement('img');
    bomb.setAttribute('class', 'bomb');
    bomb.style['opacity'] = 0;
    bomb.src = './img/bombs/01/bomb_01.png';

    let bottomInNumber = +bombermanComputed.bottom.replace('px', '');
    if (bottomInNumber % 32 === 0) {
        bomb.style['bottom'] = bombermanComputed.bottom;
    } else {
        bomb.style['bottom'] = `${Math.round(bottomInNumber / 32) * 32}px`;
    }

    let leftInNumber = +bombermanComputed.left.replace('px', '');
    if (leftInNumber % 32 === 0) {
        bomb.style['left'] = bombermanComputed.left;
    } else {
        bomb.style['left'] = `${Math.round(leftInNumber / 32) * 32}px`;
    }

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

function putBomb() {
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