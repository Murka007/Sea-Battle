// Checks if the point is outside the board
export function inBounds([x, y]) {
    return x < 0 || y < 0 || x > 9 || y > 9;
}

export function equalsArray(a, b) {
    return a.every((item, index) => item === b[index]);
}

// Rectangle collision, but size of the second rectangle increased by 1
export function shipOverlaps(pos1, pos2, i = 1) {
    const [x1, y1, w1, h1] = pos1;
    const [x2, y2, w2, h2] = pos2;
    if (x1 + w1 < x2 - i || y1 + h1 < y2 - i || x1 > x2 + w2 + i || y1 > y2 + h2 + i) {
        return true;
    }
    return false;
}

export function canPlace(board, hoverPosition, shipPosition, i) {
    return board.filter(ship => ship !== shipPosition && !shipOverlaps(hoverPosition, [ship.x, ship.y, ship.w, ship.h], i)).length === 0;
}

export function getOverlapCells(pos1, pos2) {
    const [hoverX, hoverY] = pos1;
    const [shipWidth, shipHeight] = pos2;

    const cells = [];
    for (let x=hoverX;x<=hoverX+shipWidth;x++) {
        for (let y=hoverY;y<=hoverY+shipHeight;y++) {
            const pos = [x, y];
            if (!inBounds(pos)) {
                cells.push(pos);
            }
        }
    }
    return cells;
}

export function getBoundsCells(ship) {
    const { x, y, w, h } = ship;
    const shipPosition = [x, y, w, h];
    const [x1, y1, x2, y2] = [x-1, y-1, x+w+1, y+h+1];

    const cells = [];
    for (let i=x1;i<=x2;i++) {
        for (let b=y1;b<=y2;b++) {
            const pos = [i, b, 2];
            if (!inBounds(pos) && shipOverlaps([i, b, 0, 0], shipPosition, 0)) {
                cells.push(pos);
            }
        }
    }
    return cells;
}

export function touchedShip(board, [hoverX, hoverY]) {
    return !canPlace(board, [hoverX, hoverY, 0, 0], [-1, -1, 0, 0], 0);
}
export function getWreckedShip(board, [hoverX, hoverY]) {
    return board.find(({x, y, w, h}) => !shipOverlaps([hoverX, hoverY, 0, 0], [x, y, w, h]));
}

export function removeShip(board, ship) {
    const index = board.indexOf(ship);
    board.splice(index, 1);
}

export function canRotate(board, ship) {
    const { x, y, w, h } = ship;
    const cells = getOverlapCells([x, y], [h, w]);
    const isAble = canPlace(board, [x, y, h, w], ship);

    return cells.length === (Math.max(w, h)+1) && isAble;
}

export function rotateShip(board, ship) {
    const copy = Object.assign({}, ship);
    copy.w = ship.h;
    copy.h = ship.w;
    
    removeShip(board, ship);
    board.push(copy);
}