import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PlayerList from './PlayerList';

const getUniqueId = () => {
  return Date.now.toString();
}

export const GAME_STAGE_ENUM = {
  starting: 'starting',
  betting: 'betting',
  gameOn: 'gameOn',
  finished: 'finished',
}

const initialPlayers = [
  { id: getUniqueId(), name: 'Bruno', score: 0, currentBet: null },
  { id: getUniqueId(), name: 'Dado', score: 0, currentBet: null },
  { id: getUniqueId(), name: 'Leo', score: 0, currentBet: null },
  // { id: getUniqueId(), name: 'Gero', score: 0, currentBet: null },
  // { id: getUniqueId(), name: 'Pau', score: 0, currentBet: null },
  // { id: getUniqueId(), name: 'Moui', score: 0, currentBet: null },
  // { id: getUniqueId(), name: 'Santi', score: 0, currentBet: null },
  // { id: getUniqueId(), name: 'Gambi', score: 0, currentBet: null }
];

const Game = () => {

  const [gameStage, setGameStage] = useState(GAME_STAGE_ENUM.starting);

  const [players, setPlayers] = useState(initialPlayers);
  const [winners, setWinners] = useState([]);

  const [playerName, setPlayerName] = useState('');
  //currentTurn
  const [currentTurn, setCurrentTurn] = useState(1);
  const [currentHandCards, setCurrentHandCards] = useState(1);
  const [increasingCards, setIncreasingCards] = useState(true);

  const [maxRound, setMaxRound] = useState(0);
  const [mostCardsRound, setMostCardsRound] = useState(0);

  const [currentTurnOffset, setCurrentTurnOffset] = useState(0);
  const [currentPlayerOffset, setCurrentPlayerOffset] = useState(0);
  const [playersOff, setPlayersOff] = useState(0);

  // TODO BRUNO
  // AGregar un estado que maneje la cantidad total de apuestas

  useEffect(() => {
    if (players.length > 0) {
      const max = Math.floor(48 / players.length);
      setMaxRound(max);
      if (max < mostCardsRound || mostCardsRound === 0) {
        setMostCardsRound(max);
      }
    }
  }, [players]);

  const handleInputKey = (e) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  }

  const addPlayer = () => {
    if (playerName) {
      const newPlayers = [...players, {
        id: getUniqueId(),
        name: playerName,
        score: 0,
        currentBet: null
      }];
      setPlayers(newPlayers);
      setPlayerName('');
    }
  }

  const increaseTurnOffset = () => {
    const newOffset = (currentTurnOffset + 1) % (players.length);
    setCurrentTurnOffset(newOffset);
    setCurrentPlayerOffset(newOffset);
    setPlayersOff(0);
    setCurrentTurn(currentTurn + 1);
    setGameStage(GAME_STAGE_ENUM.betting);

    checkHandCards();

    // Reseteamos los Bet en cada jugador
    const playersReseted = players.map(player => ({ ...player, currentBet: null }));
    setPlayers(playersReseted);
  }

  const checkHandCards = () => {
    let multiplier = increasingCards ? 1 : -1;

    // Calculamos la cantidad de cartas de la siguiente ronda
    if (currentHandCards + 1 > mostCardsRound) {
      setIncreasingCards(false);
      multiplier = -1;
    }
    
    const newAmountOfCards = currentHandCards + (multiplier);
    setCurrentHandCards(newAmountOfCards);

    if(newAmountOfCards <= 0) {
      toast.warn(
        'Termina el juego!!'
      );
      calculateWinners();
      setGameStage(GAME_STAGE_ENUM.finished);
    }
  }
  
  const calculateWinners = () => {
    let biggestScore = 0;
    players.map(p => {
      if (p.score > biggestScore) {
        biggestScore = p.score;
      }
    });

    const winnersArray = players.filter(p => p.score === biggestScore);
    setWinners(winnersArray);
    const winnersString = winnersArray.map(w => w.name).join(',');
    toast.success(
      `Ganaron: ${winnersString}`
    );
  }

  const increaseSelectedPlayer = () => {
    const newPlayersOff = playersOff + 1;
    // console.log('increaseSelectedPlayer, newPlayersOff=', newPlayersOff);
    // console.log('increaseSelectedPlayer, currentPlayerOffset=', currentPlayerOffset);
    if (newPlayersOff === players.length) {
      // Todos apostaron, o todos pusieron su puntaje
      if (betting) {
        toast.warn(
          'Se comienza a jugar la Mano.'
        );
        setCurrentPlayerOffset(currentTurnOffset);
        setPlayersOff(0);
        setGameStage(GAME_STAGE_ENUM.gameOn);
      } else if (gameOn) {
        toast.warn(
          'Aumenta el turno.'
        );
        increaseTurnOffset();
      }
    } else {
      setPlayersOff(newPlayersOff);

      // Aca 
      let newCurrentPlayerOffset = currentPlayerOffset + 1;
      if (newCurrentPlayerOffset + currentTurnOffset > players.length) {
        newCurrentPlayerOffset = 0;
      } 

      setCurrentPlayerOffset(newCurrentPlayerOffset);
    }
  }

  const handlePlayerBet = (index, bet) => {
    if (index >= 0 && index < players.length) {
      const copyPlayers = [...players];
      copyPlayers[index].currentBet = bet;
      setPlayers(copyPlayers);
      increaseSelectedPlayer();

       // TODO BRUNO
      // Cuando se aposto, acutalizar el total de apuestas
    }
  }

  const handlePlayerScore = (index, newScore) => {
    if (index >= 0 && index < players.length) {
      const copyPlayers = [...players];
      copyPlayers[index].score += newScore;
      setPlayers(copyPlayers);
      increaseSelectedPlayer();
    }
  }

  const startGame = () => {
    setGameStage(GAME_STAGE_ENUM.betting);
  }
  
  const starting = gameStage === GAME_STAGE_ENUM.starting;
  const betting = gameStage === GAME_STAGE_ENUM.betting;
  const gameOn = gameStage === GAME_STAGE_ENUM.gameOn;
  const finished = gameStage === GAME_STAGE_ENUM.finished;

  return (
    <div className="gameSetupForm">
      {starting && (
        <>
          <div>
          {players.length > 0 ? <p>Según la cantidad de jugadores, la ronda con más cartas puede tener {maxRound}</p> : <p>Sin jugadores aún.</p>}

            <label>Ronda con más cartas </label>
            <input
              name="mostCardsRound"
              type="number"
              max={maxRound}
              value={mostCardsRound}
              onChange={(event) => {
                const amount = parseInt(event.target.value);
                setMostCardsRound(amount);
              }}
            />
          </div>
          <div>
            <input
              name="playerName"
              type="text"
              value={playerName}
              placeholder="Agregar Jugador"
              onKeyUp={handleInputKey}
              onChange={(event) => { setPlayerName(event.target.value) }}
            />
            <button disabled={!playerName} onClick={addPlayer}>
              Agregar
            </button>
          </div>
          <div>
            <button onClick={startGame}>
              COMENZAR EL JUEGO
            </button>
          </div>
        </>
      )}
      

      <div style={{marginTop: '10px'}}>
        {/* <button onClick={increaseTurnOffset}>
          Aumentar la ronda
        </button> */}

        <p>Esta es la ronda {currentTurn}</p>
        <p>Se juegan {currentHandCards} manos</p>
        <p>Esta ronda comienza el jugador {currentTurnOffset + 1} </p>
      </div>

      {finished && (
        <div>
          Lxs ganadorxs son:
          {winners.map((w, index) => (
            <div key={`${index}`}>{w.name}</div>
          ))}
        </div>
      )}
      
      <div>
        {/*  // TODO BRUNO Pasarle el total de apuestas a playerList como prop */}
        {/* Y que PlayerList se lo pase a Player */}
        <PlayerList
          gameStage={gameStage}
          currentHandCards={currentHandCards}
          players={players}
          mostCardsRound={mostCardsRound}
          positionOffset={currentTurnOffset}
          selectedPlayerOffset={currentPlayerOffset}
          setBetToPlayer={handlePlayerBet}
          setScoreToPlayer={handlePlayerScore}
        />
      </div>
    </div>
  );

}

export default Game;