const MAGNET_UP = 1;
const MAGNET_LEFT = 2;
const MAGNET_DOWN = 3;
const MAGNET_RIGHT = 4;

const magnets = document.getElementsByClassName('magnet');

setInterval(() => {
    Array.prototype.forEach.call(magnets, magnet => {
        attractBomb(magnet);
    });
}, 100);

function directionMagnet(magnet) {
    let rotateMagnetValue = +magnet.style['transform'].replace('rotate(', '').replace('deg)', '');
    if (!rotateMagnetValue) {
        return MAGNET_UP;
    }

    let coefficientMagnet = +(rotateMagnetValue / 90 / 4).toString().substring(2, 4);
    if (coefficientMagnet === 0) {
        return MAGNET_UP;
    } else if (coefficientMagnet === 25) {
        return MAGNET_LEFT;
    } else if (coefficientMagnet === 5) {
        return MAGNET_DOWN;
    } else {
        return MAGNET_RIGHT;
    }
}

function attractBomb(magnet) {
    const bomb = document.getElementById('bomb-form');
    if (!bomb || !!bomb.classList.contains('attracted')) {
        return;
    }

    let bombBottom = +window.getComputedStyle(bomb).bottom.replace('px', '');
    let bombLeft = +window.getComputedStyle(bomb).left.replace('px', '');
    const magnetBottom = +window.getComputedStyle(magnet).bottom.replace('px', '');
    const magnetLeft = +window.getComputedStyle(magnet).left.replace('px', '');

    if (bombBottom === magnetBottom) {
        let animationBombMagnet = setInterval(() => {
            let numberToAdd;
            if (bombLeft > magnetLeft) {
                if (bombLeft - 32 === magnetLeft) {
                    clearInterval(animationBombMagnet);
                    return false;
                }

                numberToAdd = -8;
            } else {
                if (bombLeft + 32 === magnetLeft) {
                    clearInterval(animationBombMagnet);
                    return false;
                }

                numberToAdd = 8;
            }

            bombLeft += numberToAdd;
            bomb.style['left'] = `${bombLeft}px`;
        }, 70); 
    } else if (bombLeft === magnetLeft) {
        let bombBottomBefore = bombBottom;
        let animationBombMagnet = setInterval(() => {
            let numberToAdd;
            if (bombBottom > magnetBottom) {
                if (bombBottom - 32 === magnetBottom || directionMagnet(magnet) !== MAGNET_UP) {
                    const explosions = document.getElementsByClassName('explosion');
                    Array.prototype.forEach.call(explosions, explosion => {
                        let explosionBottom = +window.getComputedStyle(explosion).bottom.replace('px', '');
                        explosionBottom += bombBottom - bombBottomBefore;
                        explosion.style['bottom'] = `${explosionBottom}px`;
                    });
                    clearInterval(animationBombMagnet);
                    return false;
                }

                numberToAdd = -8;
            } else {
                if (bombBottom + 32 === magnetBottom || directionMagnet(magnet) !== MAGNET_DOWN) {
                    clearInterval(animationBombMagnet);
                    return false;
                }

                numberToAdd = 8;
            }

            bombBottom += numberToAdd;
            bomb.style['bottom'] = `${bombBottom}px`;
        }, 70);

        bomb.classList.add('attracted');
    }
}