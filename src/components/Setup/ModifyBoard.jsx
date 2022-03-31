import React from "react";

function ModifyBoard({ randomiseBoard, resetBoard }) {
    return (
        <div className="board-modify">
            <div onClick={() => randomiseBoard()} className="modify-text">Randomise</div>
            <div onClick={() => resetBoard()} className="modify-text">Reset board</div>
        </div>
    )
}

export default ModifyBoard;