import Fun from 'dataset/sets/Fun';
import styled from "styled-components";
import {useEffect, useState} from "react";

const GAME_HEIGHT = 600;
const GAME_WIDTH = 850;
const BAR_HEIGHT = 50;
const CARD_WIDTH = GAME_WIDTH / 5;
const CARD_HEIGHT = 120;
const GRAVITY = 2;

export default function Game() {
  const { disneyPrincessTrivia: quizletSet } = Fun.getAllSetsMap();
  const [gameIsActive, setGameIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctId, setCorrectId] = useState("");
  const [currTerm, setCurrTerm] = useState("Term");
  const [rowPos, setRowPos] = useState(0);

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

  // Ends the game if we ran out lives.
  useEffect(() => {
    if (gameIsActive && lives <= 0) {
      setGameIsActive(false);
      resetCards();
    }
  }, [gameIsActive, lives]);

  // Logic for clicking cards. Right = new cards. Wrong = lose a life.
  const handleClick = (e) => {
    if (e.target.id == correctId) {
      setScore(score => score + 1);
      resetCards();
    } else {
      e.target.style.backgroundColor = "#912626";
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
    document.getElementById("card-0").style.backgroundColor = "#323657";
    document.getElementById("card-1").style.backgroundColor = "#323657";
    document.getElementById("card-2").style.backgroundColor = "#323657";
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
      let img = selected[i].cardSides[1].media[1]["url"];
      document.getElementById(`card-${i}-text`).innerHTML = def;
    }
    const id = Math.floor((Math.random() * 3));
    setCorrectId(`card-${id}`);
    let term = selected[id].cardSides[1].media[0]["plainText"];
    setCurrTerm(term);
  }
  return (
    <Container onClick={startGame}>
      <Box top={0} height={BAR_HEIGHT} width={GAME_WIDTH} backgroundColor="#5838ff;">
        <span>Score: {score} | Lives: {lives}</span>
      </Box>
      <Box height={GAME_HEIGHT} width={GAME_WIDTH} top={BAR_HEIGHT} backgroundColor="#0d052e;">
        <Row top={rowPos} gap={CARD_WIDTH}>
          <Card id="card-0" height={CARD_HEIGHT} width={CARD_WIDTH} onClick={(e) => handleClick(e)}>
            <span id="card-0-text"> Definition 1 </span>
          </Card>
          <Card id="card-1" height={CARD_HEIGHT} width={CARD_WIDTH} onClick={(e) => handleClick(e)}>
            <span id="card-1-text"> Definition 2 </span>
          </Card>
          <Card id="card-2" height={CARD_HEIGHT} width={CARD_WIDTH} onClick={(e) => handleClick(e)}>
            <span id="card-2-text"> Definition 3 </span>
          </Card>
        </Row>
      </Box>
      <Box top={BAR_HEIGHT + GAME_HEIGHT} height={BAR_HEIGHT} width={GAME_WIDTH} backgroundColor="#912626;">
        <span>{currTerm}</span>
      </Box>
    </Container>
  );
}

// Objects //
const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Box = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  top: ${(props) => props.top}px;
  background-color:${(props) => props.backgroundColor};
  overflow: hidden;
  position: absolute;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50% , -50%);
    pointer-events: none;
    text-align: center
  }
`;

const Card = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  position: relative;
  background-color: #323657;
  border-radius: 10%;
`;

const Row = styled.div`
  gap: ${(props) => props.gap}px;
  top: ${(props) => props.top}px;
  position: relative;
  display: flex;
  flex-direction: row;
`;