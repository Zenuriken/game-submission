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

  // const renderMedia = (media: SerializedMedia) => {
  //   switch (media.type) {
  //     case MediaType.TEXT:
  //       const { plainText } = media as SerializedMediaText;
  //       return <div key={media.type}>{plainText}</div>;
  //     case MediaType.IMAGE:
  //       const { url } = media as SerializedMediaImage;
  //       return (
  //         <Image
  //           alt="term image"
  //           height={IMAGE_HEIGHT}
  //           key={media.type}
  //           src={url}
  //           width={IMAGE_WIDTH}
  //         />
  //       );
  //   }
  // };
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

const CARD_WIDTH = 200;
const CARD_HEIGHT = 150;
const PLAYER_SIZE = 50;
const BULLET_SIZE = 20;
const GAME_HEIGHT = 700;
const GAME_WIDTH = 1000;
const GRAVITY = 2;

export default function Page() {
  const { disneyPrincessTrivia: quizletSet } = Fun.getAllSetsMap();


  const [gameIsActive, setGameIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const [mousePos, setMousePos] = useState({x:0, y:0});
  const [bulletIsActive, setBulletIsActive] = useState(false);
  const [bulletVelocity, setBulletVelocity] = useState({x:0, y:0});
  const [correctId, setCorrectId] = useState("");
  const [currTerm, setCurrTerm] = useState("");
  const [rowPos, setRowPos] = useState(0);  

  // // Tracks the mouse's position on the screen when clicked.
  // useEffect(() => {
  //   const handleMouseClick = (event: { clientX: any; clientY: any; }) => {
  //   };
  //     window.addEventListener('click', handleMouseClick);
  //     return () => {
  //       window.removeEventListener(
  //         'click',
  //         handleMouseClick
  //       );
  //     };
  // }, []);
  
  // // Fires the bullet from the player to the mouse's clicked location.
  // useEffect(() => {
  //   let bulletId;
  //   if (bulletIsActive) {
  //     bulletId = setInterval(() => {
  //             // setBulletPos(bulletPos => {x: bulletPos.x + xVelocity, y: bulletPos.y + yVelocity})
  //           }, 12)
  //   }
  //     return () => {
  //       clearInterval(bulletId);
  //     };
  //   }, [bulletIsActive]);





  // Moves the row of cards continuously downward until it reaches the edge or the game ends.
  useEffect(() => {
    let timeId;
    if (gameIsActive && rowPos + CARD_HEIGHT < GAME_HEIGHT) {
      timeId = setInterval(() => {
        setRowPos(rowPos => rowPos + GRAVITY)
      }, 12)
      return () => {
        clearInterval(timeId);
      };
    } else if (gameIsActive) {
      setLives(lives => lives - 1);
      resetCards();
    }
  }, [gameIsActive, lives, rowPos]);


  // Constantly checks if we ran out of lives. If so, ends the game.
  useEffect(() => {
    if (gameIsActive && lives <= 0) {
      setGameIsActive(false);
      resetCards();
    }
  }, [gameIsActive, lives]);

  // Logic for clicking cards.
  const handleClick = (e) => {
    if (e.target.id == correctId) {
      e.target.style.backgroundColor = "green";
      setScore(score => score + 1);
      resetCards();
    } else {
      e.target.style.backgroundColor = "red";
      e.target.style.pointerEvents = "none";
      setLives(lives => lives - 1);
    }
  }

  // Starts the game if it isn't already active.
  const startGame = () => {
    if (!gameIsActive) {
      setGameIsActive(true);
      setScore(0);
      setLives(3);
      resetCards();
    }
  }

  // Resets the cards to their starting conditions.
  const resetCards = () => {
    document.getElementById("card-0").style.backgroundColor = "lightslategray";
    document.getElementById("card-1").style.backgroundColor = "lightslategray";
    document.getElementById("card-2").style.backgroundColor = "lightslategray";
    document.getElementById("card-0").style.pointerEvents = "auto";
    document.getElementById("card-1").style.pointerEvents = "auto";
    document.getElementById("card-2").style.pointerEvents = "auto";
    setRowPos(0);
    getCards();
  }

  // Retrieves 3 random cards and sets the id of the correct one.
  const getCards = () => {
    const shuffled = quizletSet.studiableItem.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 3);
    for (var i = 0; i < selected.length; i++) {
      let def = selected[i].cardSides[0].media[0]["plainText"];
      document.getElementById(`card-${i}-text`).innerHTML = def;
    }
    const id = Math.floor((Math.random() * 3));
    setCorrectId(`card-${id}`);
    let term = selected[id].cardSides[1].media[0]["plainText"];
    setCurrTerm(term);
  }

  return (
    <Div onClick={startGame}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Row top={rowPos}>
          <Card id="card-0" height={CARD_HEIGHT} width={CARD_WIDTH} left={0} onClick={(e) => handleClick(e)}>
            <span id="card-0-text"> Definition 1 </span>
          </Card>
          <Card id="card-1" height={CARD_HEIGHT} width={CARD_WIDTH} left={CARD_WIDTH} onClick={(e) => handleClick(e)}>
            <span id="card-1-text"> Definition 2 </span>
          </Card>
          <Card id="card-2" height={CARD_HEIGHT} width={CARD_WIDTH} left={CARD_WIDTH * 2} onClick={(e) => handleClick(e)}>
            <span id="card-2-text"> Definition 3 </span>
          </Card>
        </Row>
          <Player size={PLAYER_SIZE} top={GAME_HEIGHT - PLAYER_SIZE} marginLeft={-PLAYER_SIZE / 2}/>
          <Bullet size={BULLET_SIZE} top={GAME_HEIGHT - BULLET_SIZE} marginLeft={-BULLET_SIZE / 2}/>
      </GameBox>
      <span>Score: {score}, Lives: {lives}</span>
      <p>{currTerm}</p>
    </Div>
  );
}

// Objects //
const Player = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 10%;
  left: 50%;
  margin-left: ${(props) => props.marginLeft}px;
`;

const Bullet = styled.div`
  position: absolute;
  background-color: yellow;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
  left: 50%;
  margin-left: ${(props) => props.marginLeft}px;
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
  & p {
    color: black;
    font-size: 24px;
    position: absolute;
    top: 90%;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color:blue;
  overflow: hidden;
`;

const Card = styled.div`
  display: inline-block;
  position: relative;
  background-color: lightslategray;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  border-radius: 10%;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50% , -50%);
    -webkit-transform: translate(-50%, -50%);
    pointer-events: none;
    text-align: center
  }
`;

const Row = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
`;