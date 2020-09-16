import React from 'react';

import Player from './Player';

const PlayerList = ({ 
  gameStage,
  currentHandCards,
  players = [],
  setBetToPlayer,
  setScoreToPlayer,
  mostCardsRound,
  positionOffset,
  selectedPlayerOffset
}) => {

  const totalPlayers = players.length;
  return (
    <>
      <p> Lista de Jugadores </p>
      <div className="playersList">
        {players.map((player, index) => {
          const { id, name, score, currentBet } = player;
          // Al Indice (que arranca en 0) le sumamos el offset según la ronda
          // Y Usamos modulo para hacerlo circular sin exceder el total de jugadores.
          let position = ((index + 1) - positionOffset);
          if (position <= 0) {
            position += totalPlayers;
          }
          return (
            <Player
              index={index}
              key={`${id}_${index}`}
              gameStage={gameStage}
              currentHandCards={currentHandCards}
              name={name}
              score={score}
              currentBet={currentBet}
              position={position}
              isSelectedPlayer={selectedPlayerOffset === index}
              setBetToPlayer={setBetToPlayer}
              setScoreToPlayer={setScoreToPlayer}
            />
          );
        })}
      </div>
    </>
  )
}

export default PlayerList;