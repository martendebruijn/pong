import { useState, useEffect, useRef } from "react";

const GAME_BACKGROUND = "#000";
const PLAYER_ONE_COLOR = "#fff";
const PLAYER_TWO_COLOR = "#fff";
const BALL_COLOR = "#fff";

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [playerOneScore, setPlayerOneScore] = useState<number>(0);
  const [playerTwoScore, setPlayerTwoScore] = useState<number>(0);

  const paddleWidth = 10;
  const paddleHeight = 100;
  const ballSize = 10;

  const leftPaddleY = useRef(200);
  const rightPaddleY = useRef(200);
  const ballX = useRef(300);
  const ballY = useRef(200);
  const ballSpeedX = useRef(4);
  const ballSpeedY = useRef(3);

  const drawGame = () => {
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    // Background
    context.fillStyle = GAME_BACKGROUND;
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Player one paddle
    context.fillStyle = PLAYER_ONE_COLOR;
    context.fillRect(10, leftPaddleY.current, paddleWidth, paddleHeight);

    // Player two paddle
    context.fillStyle = PLAYER_TWO_COLOR;
    context.fillRect(
      canvasRef.current.width - paddleWidth - 10,
      rightPaddleY.current,
      paddleWidth,
      paddleHeight
    );

    // Ball
    context.beginPath();
    context.arc(ballX.current, ballY.current, ballSize, 0, Math.PI * 2);
    context.fillStyle = BALL_COLOR;
    context.fill();
    context.closePath();

    // Move the ball
    ballX.current += ballSpeedX.current;
    ballY.current += ballSpeedY.current;

    // Ball collision with top and bottom
    if (ballY.current <= 0 || ballY.current >= canvasRef.current.height) {
      ballSpeedY.current = -ballSpeedY.current;
    }

    // Ball collision with paddels
    if (
      ballX.current <= paddleWidth &&
      ballY.current >= leftPaddleY.current &&
      ballY.current <= leftPaddleY.current + paddleHeight
    ) {
      ballSpeedX.current = -ballSpeedX.current;
    }

    if (
      ballX.current >= canvasRef.current.width - paddleWidth - ballSize &&
      ballY.current >= rightPaddleY.current &&
      ballY.current <= rightPaddleY.current + paddleHeight
    ) {
      ballSpeedX.current = -ballSpeedX.current;
    }

    // Score bij punt verlies
    if (ballX.current <= 0) {
      setPlayerTwoScore((prev) => prev + 1);
      resetBall();
    }

    if (ballX.current >= canvasRef.current.width) {
      setPlayerOneScore((prev) => prev + 1);
      resetBall();
    }

    // Update the game every 10ms
    requestAnimationFrame(drawGame);
  };

  const resetBall = () => {
    if (!canvasRef.current) return;

    ballX.current = canvasRef.current.width / 2;
    ballY.current = canvasRef.current.height / 2;
    ballSpeedX.current = -ballSpeedX.current; // Change the direction of the ball
    ballSpeedY.current = Math.random() > 0.5 ? 3 : -3;
  };

  const movePlayerOnePaddle = (e: KeyboardEvent) => {
    if (!canvasRef.current) return;

    if (e.key === "ArrowUp" && leftPaddleY.current > 0) {
      leftPaddleY.current -= 20;
    } else if (
      e.key === "ArrowDown" &&
      leftPaddleY.current < canvasRef.current?.height - paddleHeight
    ) {
      leftPaddleY.current += 20;
    }
  };

  const movePlayerTwoPaddle = (e: KeyboardEvent) => {
    if (!canvasRef.current) return;

    if (e.key === "w" && rightPaddleY.current > 0) {
      rightPaddleY.current -= 20;
    } else if (
      e.key === "s" &&
      rightPaddleY.current < canvasRef.current?.height - paddleHeight
    ) {
      rightPaddleY.current += 20;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", movePlayerOnePaddle);
    document.addEventListener("keydown", movePlayerTwoPaddle);
    drawGame();
    return () => {
      document.removeEventListener("keydown", movePlayerOnePaddle);
      document.removeEventListener("keydown", movePlayerTwoPaddle);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <div className="text-white mb-4">
        <h1 className="text-4xl">Pong</h1>
        <div className="flex space-x-10">
          <span>{playerOneScore}</span>
          <span>{playerTwoScore}</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border-2 border-white"
      />
    </div>
  );
}
