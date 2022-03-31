import React, { useContext, useState } from "react";
import Cell from "./Cell";
import Ship from "../Ship";
import { getBoundsCells, getWreckedShip, touchedShip } from "../../utils/Board";
import { GameContext } from "../../context";
import ShipList from "./ShipList";
import { getChar } from "../../utils/Common";

function Table({ type, board, classNames }) {

    const { turn, setTurn, getMove, removeMove, winner, setWinner } = useContext(GameContext);
    const classList = ["table-centered"];
    if (classNames && classNames.length) classList.push(...classNames.split(" "));

    const [clickedCells, setClickedCells] = useState([]);
    const [changes, setChanges] = useState(false);
    const [destroyedShips, setDestroyedShips] = useState([]);

    const list = [[], [], [], []];
    for (const ship of board) {
        list[Math.max(ship.w, ship.h)].push(ship);
    }
    const [shipList, setShipList] = useState(list.reverse());

    function setCell([hoverX, hoverY]) {
        const touched = touchedShip(board, [hoverX, hoverY]);
        if (touched) {
            const wreckedShip = getWreckedShip(board, [hoverX, hoverY]);
            wreckedShip.health -= 1;
            if (wreckedShip.health < 1) {
                destroyedShips.push(wreckedShip);

                if (destroyedShips.length === 10 && winner === null) {
                    setWinner(type);
                }

                /* Get bound cells and push them */
                const boundCells = getBoundsCells(wreckedShip);
                for (const cell of boundCells) {
                    const [cellX, cellY] = cell;
                    const hasRepeats = clickedCells.find(([x, y]) => x === cellX && y === cellY);
                    if (!hasRepeats) {
                        clickedCells.push(cell);

                        if (type === 0 && turn) removeMove([cellX, cellY]);
                    }
                }
            }
        }

        clickedCells.push([hoverX, hoverY, touched ? 1 : 0]);
        if (type === 0 && turn) removeMove([hoverX, hoverY]);
        if (touched) {
            setChanges(!changes);
        } else {
            setTurn(!turn);
        }
    }

    function updateCell() {
        setTimeout(() => {
            const move = getMove();
            if (move !== null) setCell(move);
        }, 500)
    }
    if (type === 0 && turn && winner === null) updateCell();

    const rows = [];
    for (let row=0;row<10;row++) {
        const cells = [];
        for (let cell=0;cell<10;cell++) {
            const markers = [];
            if (cell === 0) markers.push(<div key={0} className="marker marker-row no-events">{row+1}</div>);
            if (row === 0) markers.push(<div key={1} className="marker marker-col no-events">{getChar(cell)}</div>);

            const destroyedShip = destroyedShips.length && destroyedShips.find(({x, y}) => x === cell && row === y);

            /* Left board */
            if (!type || winner === 0) {
                const ship = board.length && board.find(({x, y}) => x === cell && row === y);
                if (ship && destroyedShip && ship != destroyedShip || ship && !destroyedShip) {
                    const elem = (
                        <Ship
                            key={2}
                            shipPosition={ship}
                            classNames={type ? "no-events" : ""}
                        />
                    );
                    markers.push(elem);
                }
            }

            if (destroyedShip) {
                const elem = (
                    <Ship
                        key={2}
                        shipPosition={destroyedShip}
                        classNames={"ship-destroyed"}
                    />
                );
                markers.push(elem);
            }

            const td = (
                <Cell
                    key={cell}
                    {...{type, setCell, clickedCells}}
                    x={cell}
                    y={row}
                >
                    {markers}
                </Cell>
            );
            cells.push(td);
        }
        rows.push(<tr key={row}>{cells}</tr>);
    }

    const tableNames = ["table-ship"];
    if (type === 1 && turn && winner === null) tableNames.push("disabled");
    return (
        <div className={classList.join(" ")}>
            <h2 className="table-head-text">{ (type ? "Opponent" : "Your") + " board" }</h2>
            <table className={tableNames.join(" ")}>
                <tbody>
                    {rows}
                </tbody>
            </table>

            <ShipList {...{type, shipList}}/>
        </div>
    );
}

export default Table;