import React, { useContext } from "react";
import { BoardContext } from "../../context";

function Cell({children, x, y}) {
    const { setCell, overlapCells, current } = useContext(BoardContext);
    const classList = ["cell"];

    const isTargeting = overlapCells.length && overlapCells.some(([x1, y1]) => x1 === x && y1 === y);
    if (isTargeting) classList.push("green");
    return (
        <td
            className={classList.join(" ")}
            onMouseEnter={() => setCell(x - current.mapX, y - current.mapY)}
        >
            {children}
        </td>
    );
}
export default Cell;