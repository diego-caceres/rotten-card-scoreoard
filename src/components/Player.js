
import React, { useState } from 'react';

import { GAME_STAGE_ENUM } from './Game';

const Player = ({ 
  index,
  gameStage,
  currentHandCards,
  name,
  score,
  currentBet,
  position,
  isSelectedPlayer,
  setBetToPlayer,
  setScoreToPlayer
}) => {
  const [bet, setBet] = useState(0);
  const [handsWon, setHandsWon] = useState(0);

  const starting = gameStage === GAME_STAGE_ENUM.starting;
  const betting = gameStage === GAME_STAGE_ENUM.betting;
  const gameOn = gameStage === GAME_STAGE_ENUM.gameOn;
  const finished = gameStage === GAME_STAGE_ENUM.finished;

  const handleScoreConfirm = () => {

    // Comparamos la apuesta con cuantas manos gano
    // para calcular los puntos
    let points = 0;
    if (handsWon === currentBet) {
      // Emboco!!
      points = (handsWon * 3) + 10;
    } else {
      points = Math.abs(handsWon - currentBet) * -3;
    }

    setScoreToPlayer(index, points);
    setHandsWon(0);
  }

  const handleBetConfirm = () => {
    setBetToPlayer(index, bet);
    setBet(0);
  }

  const renderBet = () => {
    if (isSelectedPlayer && betting) { 
      return (
        <>
          <div>
            Aposta amigo
          </div>
          <div>
            <input min={0} max={currentHandCards} className="betInput" type="number" value={bet} onChange={(e) => setBet(e.target.value)} />
            <button className="betBtn" onClick={handleBetConfirm}> ✅ </button>
          </div>
        </>
      )
    }
    
    if (currentBet != null) {
      return (
        <>
          <div> Apuesta </div>
          <div>{currentBet}</div>
        </>
      );
    } else {
      return (
        <>
          <div> Sin </div>
          <div> Apuesta </div>
        </>
      )
    }
  }

  const renderGameResult = () => {
    if (isSelectedPlayer && gameOn) { 
      return (
        <>
          <div> Cuantas manos gano? </div>
          <div>
            <input min={0} max={currentHandCards} className="betInput" type="number" value={handsWon} onChange={(e) => setHandsWon(e.target.value)} />
            <button className="betBtn" onClick={handleScoreConfirm}> ✅ </button>
          </div>
        </>
      );
    }
    else {
      return (
        <p>Gano {handsWon} manos</p>
      )
    }
  }

  const selectedStyle = isSelectedPlayer ? { backgroundColor: '#691d28'} : {};
 
  return (
    <div className="card" style={selectedStyle}>
      <div className="container">
        <div className="playerName">
         {position === 1 && '**'} {name} {position === 1 && '**'}
        </div>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          Jugador {index + 1}
        </div>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          Puntaje {score}
        </div>
        {!finished && (
          <>
            <div className="playerRow">
              <div className="playerCell">
                <div>
                  Orden
                </div>
                <div>
                  {position}
                </div>
              </div>
              <div className="vertical-line"></div>
              {starting && (
                <div> Iniciando </div>
              )}
              {(betting || gameOn) && (
                <div className="playerCell">
                  {renderBet()}
                </div>
              )}
            </div>
            <div>
              {gameOn && (
                <div className="playerCell">
                  {renderGameResult()}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Player;