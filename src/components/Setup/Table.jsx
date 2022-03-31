import React, { useContext } from "react";
import { BoardContext } from "../../context";
import Cell from "./Cell";
import Ship from "../Ship";
import { getChar } from "../../utils/Common";

function TableShip() {
    const { board, dragStart, rotate } = useContext(BoardContext);
    
    const rows = [];
    for (let row=0;row<10;row++) {
        const cells = [];
        for (let cell=0;cell<10;cell++) {
            const markers = [];
            if (cell === 0) markers.push(<div key={0} className="marker marker-row no-events">{row+1}</div>);
            if (row === 0) markers.push(<div key={1} className="marker marker-col no-events">{getChar(cell)}</div>);

            const ship = board.length && board.find(({x, y}) => x === cell && row === y);
            if (ship) {
                const elem = (
                    <Ship
                        key={2}
                        shipPosition={ship}
                        onMouseDown={(event) => dragStart(event, ship)}
                        onClick={(event) => rotate(event, ship)}
                    />
                );
                markers.push(elem);
            }

            const td = <Cell key={cell} {...{x: cell, y: row}}>{markers}</Cell>
            cells.push(td);
        }
        rows.push(<tr key={row}>{cells}</tr>);
    }

    return (
        <div className="table-centered">
            <h2 className="table-head-text">Your board</h2>
            <table className="table-ship">
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    );
}
export default TableShip;