import React, { useState } from "react";
import useWindowSize from "./hooks/useWindowSize";
import "./styles/App.css";
import "./styles/Board.css";
import "./styles/Ship.css";
import { generateBoard, getScale } from "./utils/Common";
import SetupBoard from "./components/SetupBoard";
import GameBoard from "./components/GameBoard";
import { CSSTransition } from "react-transition-group";

function App() {
  const size = useWindowSize();
  const scale = getScale(size);

  const [difficulty, setDifficulty] = useState(0);
  const [board1, setBoard1] = useState([]);
  const [board2, setBoard2] = useState(generateBoard());

  return (
    <div className="page-container no-select" style={{transform: "translate(-50%, -50%) scale(" + scale + ")"}}>
      <div className="page-wrapper">
        <div className="logo-container">
          <div className="logo-ship"></div>
          <h1 className="logo-text shadowed">Sea Battle</h1>
        </div>
        {
          board1.length === 10 ? <GameBoard {...{board1, board2, setBoard1, setBoard2, difficulty}}></GameBoard> : <SetupBoard {...{scale, setBoard1, difficulty, setDifficulty}}></SetupBoard>
        }
      </div>
    </div>
  );
}

export default App;
