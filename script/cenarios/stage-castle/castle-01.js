const gameBoard = document.getElementById('game-board');
const obstacleWidth = 32;
const obstacleHeight = 32;

let topObstacle = 64;
let leftObstacle = 96;

function constructObstacle(lineNumber, colNumber) {
    const idObstacle = `obstacle-${lineNumber}-${colNumber}`;

    gameBoard.innerHTML += `<img src="./img/stages/castle/obstacle.png" id="${idObstacle}" class="obstacle">`;

    const obstacle = document.querySelector(`#${idObstacle}`);

    obstacle.style.top = `${topObstacle}px`;
    obstacle.style.left = `${leftObstacle}px`;
}

for (let i = 1; i <= 4; i++) {
    constructObstacle(1, i);
    leftObstacle += (obstacleWidth * 2);
}

topObstacle = 128;

for (let i = 2; i <= 4; i++) {
    leftObstacle = 95;

    for (let j = 1; j <= 6; j++) {
        constructObstacle(i, j);
        leftObstacle += (obstacleWidth * 2);
    }

    if (i === 2) {
        topObstacle += (obstacleHeight * 4);
    } else {
        topObstacle += (obstacleHeight * 2);
    }
}