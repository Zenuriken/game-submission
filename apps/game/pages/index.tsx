import Quizlet from 'dataset';
import Fun from 'dataset/sets/Fun';
import styled from "styled-components";
import {useEffect, useState} from "react";


import {
  CardSide,
  MediaType,
  SerializedMedia,
  SerializedMediaImage,
  SerializedMediaText,
  StudiableItem,
} from 'dataset/types';
import Image from 'next/image';

const IMAGE_HEIGHT = 100;
const IMAGE_WIDTH = 120;
// export default function Game() {
//   // If you don't want SSR
//   if (typeof window !== 'undefined') return null;

//   // to get a specific Set
//   const { disneyPrincessTrivia: quizletSet } = Fun.getAllSetsMap();
//   // const quizletSet = Quizlet.getRandomSet();

//   const renderMedia = (media: SerializedMedia) => {
//     switch (media.type) {
//       case MediaType.TEXT:
//         const { plainText } = media as SerializedMediaText;
//         return <div key={media.type}>{plainText}</div>;
//       case MediaType.IMAGE:
//         const { url } = media as SerializedMediaImage;
//         return (
//           <Image
//             alt="term image"
//             height={IMAGE_HEIGHT}
//             key={media.type}
//             src={url}
//             width={IMAGE_WIDTH}
//           />
//         );
//     }
//   };
//   const renderTerm = (studiableItem: StudiableItem) => (
//     <div key={studiableItem.id}>
//       {studiableItem.cardSides.map(cardSide => {
//         const { label, media } = cardSide;
//         return (
//           <div key={cardSide.sideId}>
//             {label}: {media.map(termMedia => renderMedia(termMedia))}
//           </div>
//         );
//       })}
//     </div>
//   );

//   const renderTerms = (studiableItems: StudiableItem[]) => (
//     <>
//       <h3>({studiableItems.length} Terms)</h3>
//       {studiableItems.map(studiableItem => renderTerm(studiableItem))}
//     </>
//   );

//   return (
//     <div>
//       <h1>Your game title here!</h1>
//       <h2>Set used: {quizletSet.set.title}</h2>
//       {renderTerms(quizletSet.studiableItem)}
//     </div>
//   );
// }


const PLAYER_SIZE = 30;
const GAME_HEIGHT = 500;
const GAME_WIDTH = 500;
const GRAVITY = 3;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

export default function Page() {
  
  const [playerPos, setPlayerPos] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);


  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  // Moves the player continuously downward until it reaches the edge.
  useEffect(() => {
    let timeId;
    if (gameHasStarted && playerPos < GAME_HEIGHT - PLAYER_SIZE) {
      timeId = setInterval(() => {
        setPlayerPos(playerPos => playerPos + GRAVITY)
      }, 12)
    }
    return () => {
      clearInterval(timeId);
    };
  }, [playerPos, gameHasStarted]);

  // Moves the obstacle continuously to the right until it reaches the right edge.
  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 12);
      return () => {
        clearInterval(obstacleId);
      };
    }
    else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
      setScore(score => score + 1);
    }
  }, [obstacleLeft, gameHasStarted]);


  // Checks for collision between the player and the obstacles.
  useEffect(() => {
    const hasCollidedWithTopObstacle = playerPos >= 0 && playerPos < obstacleHeight;
    const hasCollidedWithBottomObstacle = playerPos <= 500 && playerPos >= 500 - bottomObstacleHeight;
    
    if (obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (hasCollidedWithBottomObstacle || hasCollidedWithTopObstacle)) {
      setGameHasStarted(false);
    }
  }, [obstacleLeft, gameHasStarted, playerPos, obstacleHeight, bottomObstacleHeight]);


  // Logic for jumping.
  const handleClick = () => {
    let newPlayerPos = playerPos - JUMP_HEIGHT;

    if (!gameHasStarted) {
      setGameHasStarted(true);
      setScore(score => 0);
    } else if (newPlayerPos < 0) {
      setPlayerPos(0);
    } else {
      setPlayerPos(newPlayerPos);
    }
  }


  return (
    <Div onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Obstacle 
          top={0}
          width={OBSTACLE_WIDTH}
          height={obstacleHeight}
          left={obstacleLeft}
        />
        <Obstacle
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
          width={OBSTACLE_WIDTH}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />
        <Player size={PLAYER_SIZE} top={playerPos}/>
      </GameBox>
      <span> {score} </span>
    </Div>
  );
}

const Player = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color:blue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  top: ${(props) => props.top}px;
  background-color:green;
  left: ${(props) => props.left}px;
`;

