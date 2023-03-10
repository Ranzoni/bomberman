const gameBoard = document.getElementById('game-board');
const obstacleWidth = 32;
const obstacleHeight = 32;

function buildItem(lineNumber, colNumber, itemName, topItem, leftItem, esconder = false) {
    const idItem = `${itemName}-${lineNumber}-${colNumber}`;
    
    gameBoard.innerHTML += `<img src="./img/stages/castle/${itemName}.png" id="${idItem}" class="obstacle ${itemName}">`;
    
    const item = document.querySelector(`#${idItem}`);
    
    item.style.top = `${topItem}px`;
    item.style.left = `${leftItem}px`;
    if (esconder) {
        item.style.zIndex = '-1';
    }
}

function loopToBuildFixedObstacles() {
    let topObstacle = 64;
    let leftObstacle = 96;

    for (let i = 1; i <= 4; i++) {
        buildItem(1, i, 'fixed-obstacle', topObstacle, leftObstacle);
        leftObstacle += (obstacleWidth * 2);
    }
    
    topObstacle = 128;
    
    for (let i = 2; i <= 4; i++) {
        leftObstacle = 96;
    
        for (let j = 1; j <= 6; j++) {
            buildItem(i, j, 'fixed-obstacle', topObstacle, leftObstacle);
            leftObstacle += (obstacleWidth * 2);
        }
    
        if (i === 2) {
            topObstacle += (obstacleHeight * 4);
        } else {
            topObstacle += (obstacleHeight * 2);
        }
    }
}

function buildChests() {
    buildItem(1, 1, 'chest', 64, 64);
    buildItem(1, 2, 'chest', 64, 128);
    buildItem(1, 3, 'chest', 64, 192);
    buildItem(1, 4, 'chest', 64, 256);

    buildItem(2, 1, 'chest', 96, 288);
    buildItem(2, 2, 'chest', 96, 448);

    buildItem(3, 1, 'chest', 128, 192);
    buildItem(3, 2, 'chest', 128, 448);

    buildItem(4, 1, 'chest', 160, 96);
    buildItem(4, 2, 'chest', 160, 288);

    buildItem(5, 1, 'chest', 224, 160);
    buildItem(5, 2, 'chest', 224, 192);
    buildItem(5, 3, 'chest', 224, 224);
    buildItem(5, 4, 'chest', 224, 288);
    buildItem(5, 5, 'chest', 224, 320);
    buildItem(5, 6, 'chest', 224, 352);

    buildItem(6, 1, 'chest', 256, 192);
    buildItem(6, 2, 'chest', 256, 320);

    buildItem(7, 1, 'chest', 288, 192);
    buildItem(7, 2, 'chest', 288, 320);

    buildItem(8, 1, 'chest', 320, 192);
    buildItem(8, 2, 'chest', 320, 256);
    buildItem(8, 3, 'chest', 320, 320);

    buildItem(9, 1, 'chest', 352, 64);
    buildItem(9, 2, 'chest', 352, 96);
    buildItem(9, 3, 'chest', 352, 128);
    buildItem(9, 4, 'chest', 352, 384);
    buildItem(9, 5, 'chest', 352, 416);
    buildItem(9, 6, 'chest', 352, 448);
}

function buildWalls() {
    let leftPosInitial = 64;
    for (var i = 1; i <= 9; i++) {
        buildItem(1, i, 'profile_water_wall', 32, leftPosInitial);
        leftPosInitial += 32;
    }

    buildItem(1, 10, 'profile_water_wall', 32, 448);

    let topPositionInitial = 64;
    for (var i = 1; i <= 4; i++) {
        buildItem(1, i, 'left_double_wall', topPositionInitial, 32);
        topPositionInitial += 32;
    }

    topPositionInitial = 64;
    for (var i = 1; i <= 4; i++) {
        buildItem(1, i, 'right_double_wall', topPositionInitial, 480);
        topPositionInitial += 32;
    }

    buildItem(1, 1, 'profile_wall', 192, 65);
    buildItem(1, 1, 'left_stair_corner', 192, 97);
    buildItem(1, 1, 'right_stair_corner', 192, 160);

    leftPosInitial = 192;
    for (var i = 2; i <= 6; i++) {
        buildItem(1, i, 'profile_wall', 192, leftPosInitial);
        leftPosInitial += 32;
    }

    buildItem(1, 2, 'left_stair_corner', 192, 352);
    buildItem(1, 2, 'right_stair_corner', 192, 416);

    buildItem(1, 7, 'profile_wall', 192, 448);

    buildItem(1, 1, 'left_wall_corner_01', 224, 64);

    buildItem(1, 1, 'left_wall', 288, 64);

    buildItem(1, 1, 'right_wall_corner_01', 224, 448);

    buildItem(1, 1, 'right_wall', 288, 448);

    buildItem(1, 1, 'left_wall_corner_02', 320, 64);

    buildItem(1, 2, 'left_wall', 352, 32, true);

    buildItem(1, 2, 'right_wall', 352, 480, true);

    buildItem(1, 1, 'right_wall_corner_02', 320, 448);

    leftPosInitial = 64;
    for (var i = 1; i <= 13; i++) {
        if (i % 2 === 0) {
            buildItem(1, i, 'profile_wall_window', 384, leftPosInitial);
        } else {
            buildItem(1, i, 'profile_wall_down', 384, leftPosInitial);
        }

        leftPosInitial += 32;
    }
}

loopToBuildFixedObstacles();
buildChests();
buildWalls();