import { canPlace, equalsArray, getBoundsCells, getOverlapCells } from "./Board";

export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getScale([width, height]) {
    return Math.min(width / 1280, height / 720);
}

export function getChar(code) {
    return String.fromCharCode(97 + code).toUpperCase();
}

export function map(value, start1, stop1, start2, stop2) {
    return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function getMoves(board, difficulty) {
    const moves = [];
    for (let i=0;i<10;i++) {
        for (let b=0;b<10;b++) {
            moves.push([i, b]);
        }
    }
    if (board === undefined && difficulty === undefined) return moves;

    const outputMoves = [];
    const cells = board.map(ship => getOverlapCells([ship.x, ship.y], [ship.w, ship.h])).flat();
    const boundCells = board.map(ship => getBoundsCells(ship)).flat();

    if (difficulty === 0) outputMoves.push(...moves);
    if (difficulty === 1 || difficulty === 2) {
        const type = {
            1: 0,
            2: 20
        }
        outputMoves.push(...cells);
        for (let i=boundCells.length-1;i>=type[difficulty];i-=1) {
            const move = boundCells[i];
            const hasRepeat = outputMoves.find(smove => equalsArray(smove, move));

            if (!hasRepeat) {
                outputMoves.push(move);
            }
            boundCells.splice(i, 1);
        }
    }
    return outputMoves;
}

export function getSetupShips() {
    return [
        [
            { id: 6, x: -1, y: -1, w: 0, h: 0, health: 1 },
            { id: 7, x: -1, y: -1, w: 0, h: 0, health: 1 },
            { id: 8, x: -1, y: -1, w: 0, h: 0, health: 1 },
            { id: 9, x: -1, y: -1, w: 0, h: 0, health: 1 }
        ],
        [
            { id: 3, x: -1, y: -1, w: 1, h: 0, health: 2 },
            { id: 4, x: -1, y: -1, w: 1, h: 0, health: 2 },
            { id: 5, x: -1, y: -1, w: 1, h: 0, health: 2 }
        ],
        [
            { id: 1, x: -1, y: -1, w: 2, h: 0, health: 3 },
            { id: 2, x: -1, y: -1, w: 2, h: 0, health: 3 }
        ],
        [
            { id: 0, x: -1, y: -1, w: 3, h: 0, health: 4 }
        ]
    ];
}

export function generateBoard() {
    const defaultShips = getSetupShips().flat();
    const moves = getMoves();

    function removeMoves(movesToDelete) {
        for (const [x, y] of movesToDelete) {
            const index = moves.findIndex(([posX, posY]) => posX === x && posY === y);
            if (index >= 0) moves.splice(index, 1);
        }
    }
    const newShips = [];

    while (newShips.length !== 10 && moves.length && defaultShips.length) {
        const index = random(0, moves.length-1);
        const [x, y] = moves[index];
        const shipIndex = defaultShips.length - 1;
        const ship = defaultShips[shipIndex];

        function tryBoth(w, h) {
            const cells = getOverlapCells([x, y], [w, h]);
            const isAble = canPlace(newShips, [x, y, w, h]);
            const isAbleToPlaceShip = isAble && cells.length === (Math.max(w, h) + 1);
            if (isAbleToPlaceShip) {
                ship.x = x;
                ship.y = y;
                ship.w = w;
                ship.h = h;

                const boundCells = getBoundsCells(ship);
                removeMoves(boundCells);
                removeMoves(cells);
                defaultShips.splice(shipIndex, 1);
                newShips.push(ship);
                return true;
            }
            return false;
        }
        const tried1 = tryBoth(ship.w, ship.h);
        if (!tried1) {
            tryBoth(ship.h, ship.w);
        }  
    }
    return newShips;
}