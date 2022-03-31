import React, { useContext } from "react";
import { GameContext } from "../../context";
import { generateBoard } from "../../utils/Common";

function GameEnd({ setBoard1, setBoard2 }) {

    const { winner } = useContext(GameContext);

    function resetGame() {
        setBoard1([]);
        setBoard2(generateBoard());
    }
    return (
        <>
            {
                winner !== null && (
                    <div onClick={resetGame} className="game-end-container">
                        <h3 className="game-end-header shadowed">{winner === 0 ? "You lost" : "You won"}</h3>
                        <h5 className="shadowed-tiny">Click to start a new game!</h5>
                    </div>
                )
            }
        </>
    );
}

export default GameEnd;