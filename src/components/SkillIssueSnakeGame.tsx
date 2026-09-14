import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const GRID_SIZE = 20;
const TICK_SPEED_MS = 130;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };
type GameStatus = 'IDLE' | 'PLAYING' | 'GAME_OVER';

const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 9 },
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const SkillIssueSnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 10, y: 4 });
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('IDLE');
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('ohknee_snake_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  // Synchronous game refs to guarantee zero state race conditions
  const snakeRef = useRef<Position[]>(INITIAL_SNAKE);
  const directionRef = useRef<Direction>('UP');
  const nextDirectionRef = useRef<Direction>('UP');
  const foodRef = useRef<Position>({ x: 10, y: 4 });
  const statusRef = useRef<GameStatus>('IDLE');
  const scoreRef = useRef<number>(0);

  // Audio Context Ref for crisp 8-bit sound effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBip = useCallback((freq = 520, duration = 0.04) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted
    }
  }, []);

  const getRandomFood = useCallback((currentSnake: Position[]): Position => {
    let attempts = 0;
    while (attempts < 500) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      const collision = currentSnake.some((seg) => seg.x === x && seg.y === y);
      if (!collision) {
        return { x, y };
      }
      attempts++;
    }
    return { x: 5, y: 5 };
  }, []);

  // Direction handler with REVERSED mappings:
  // User intended UP    -> Actual movement is DOWN
  // User intended DOWN  -> Actual movement is UP
  // User intended LEFT  -> Actual movement is RIGHT
  // User intended RIGHT -> Actual movement is LEFT
  const applyDirection = useCallback(
    (actualDir: Direction) => {
      // If currently IDLE or GAME_OVER, start immediately!
      if (statusRef.current === 'IDLE' || statusRef.current === 'GAME_OVER') {
        const startSnake: Position[] = [
          { x: 10, y: 10 },
          { x: 10, y: 11 },
          { x: 10, y: 12 },
          { x: 10, y: 13 },
        ];
        snakeRef.current = startSnake;
        directionRef.current = actualDir;
        nextDirectionRef.current = actualDir;
        scoreRef.current = 0;
        setScore(0);
        const newFood = getRandomFood(startSnake);
        foodRef.current = newFood;
        setFood(newFood);
        setSnake(startSnake);
        statusRef.current = 'PLAYING';
        setGameStatus('PLAYING');
        playBip(520, 0.05);
        return;
      }

      // If already PLAYING: ignore reversing directly into self
      const current = directionRef.current;
      if (
        (actualDir === 'UP' && current === 'DOWN') ||
        (actualDir === 'DOWN' && current === 'UP') ||
        (actualDir === 'LEFT' && current === 'RIGHT') ||
        (actualDir === 'RIGHT' && current === 'LEFT')
      ) {
        return;
      }

      nextDirectionRef.current = actualDir;
      playBip(650, 0.02);
    },
    [getRandomFood, playBip]
  );

  const handleInput = useCallback(
    (intended: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      // Apply the reversal!
      let actual: Direction;
      switch (intended) {
        case 'UP':
          actual = 'DOWN'; // Up goes Down
          break;
        case 'DOWN':
          actual = 'UP'; // Down goes Up
          break;
        case 'LEFT':
          actual = 'RIGHT'; // Left goes Right
          break;
        case 'RIGHT':
          actual = 'LEFT'; // Right goes Left
          break;
      }
      applyDirection(actual);
    },
    [applyDirection]
  );

  const resetToIdle = useCallback(() => {
    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = 'UP';
    nextDirectionRef.current = 'UP';
    statusRef.current = 'IDLE';
    scoreRef.current = 0;
    const newFood = { x: 10, y: 4 };
    foodRef.current = newFood;

    setSnake(INITIAL_SNAKE);
    setFood(newFood);
    setScore(0);
    setGameStatus('IDLE');
    playBip(440, 0.05);
  }, [playBip]);

  // Main game loop running on fixed TICK_SPEED_MS
  useEffect(() => {
    const timer = setInterval(() => {
      if (statusRef.current !== 'PLAYING') return;

      const curSnake = snakeRef.current;
      const curDir = nextDirectionRef.current;
      directionRef.current = curDir;

      const head = { ...curSnake[0] };
      if (curDir === 'UP') head.y -= 1;
      else if (curDir === 'DOWN') head.y += 1;
      else if (curDir === 'LEFT') head.x -= 1;
      else if (curDir === 'RIGHT') head.x += 1;

      // 1. Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        statusRef.current = 'GAME_OVER';
        setGameStatus('GAME_OVER');
        playBip(160, 0.25);
        return;
      }

      // 2. Self collision (exclude tail tip since it moves forward unless eating)
      const curFood = foodRef.current;
      const willEat = head.x === curFood.x && head.y === curFood.y;
      const bodySegmentsToCheck = willEat ? curSnake : curSnake.slice(0, -1);

      if (bodySegmentsToCheck.some((seg) => seg.x === head.x && seg.y === head.y)) {
        statusRef.current = 'GAME_OVER';
        setGameStatus('GAME_OVER');
        playBip(160, 0.25);
        return;
      }

      const newSnake = [head, ...curSnake];

      if (willEat) {
        playBip(880, 0.05);
        scoreRef.current += 1;
        setScore(scoreRef.current);
        if (scoreRef.current > highScore) {
          setHighScore(scoreRef.current);
          try {
            localStorage.setItem('ohknee_snake_highscore', String(scoreRef.current));
          } catch {}
        }
        const nextFood = getRandomFood(newSnake);
        foodRef.current = nextFood;
        setFood(nextFood);
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
      setSnake(newSnake);
    }, TICK_SPEED_MS);

    return () => clearInterval(timer);
  }, [getRandomFood, highScore, playBip]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleInput('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleInput('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleInput('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleInput('RIGHT');
          break;
        case 'r':
        case 'R':
          resetToIdle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, resetToIdle]);

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-sm sm:max-w-md mx-auto py-3 px-3 select-none pb-24">
      {/* Minimal Score & Reset Bar */}
      <div className="w-full max-w-[350px] sm:max-w-[400px] flex items-center justify-between font-mono text-xs text-zinc-400 mb-2 px-1">
        <div className="flex items-center gap-3">
          <span>
            SCORE: <strong className="text-white font-bold">{score}</strong>
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-500">BEST: {highScore}</span>
        </div>
        <button
          type="button"
          onClick={resetToIdle}
          className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded bg-zinc-900/60 border border-zinc-800"
          title="Reset"
        >
          <RotateCcw size={12} />
          <span>RESET</span>
        </button>
      </div>

      {/* BARE-BONES WHITE SCREEN (NOKIA STYLE MINIMALIST) */}
      <div
        id="snake-white-screen"
        onClick={() => {
          if (gameStatus === 'IDLE' || gameStatus === 'GAME_OVER') {
            applyDirection('UP');
          }
        }}
        className="relative w-full aspect-square max-w-[350px] sm:max-w-[400px] bg-white border-4 border-zinc-600 rounded shadow-2xl overflow-hidden cursor-pointer flex items-center justify-center"
      >
        {/* Crisp Vector SVG Snake & Food (Resolution Independent) */}
        <svg
          viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`}
          className="w-full h-full bg-white block"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Subtle grid background dot matrix (Bare bones Nokia style) */}
          <rect width={GRID_SIZE} height={GRID_SIZE} fill="#ffffff" />

          {/* Snake Segments (Solid black pixels) */}
          {snake.map((seg, idx) => {
            const isHead = idx === 0;
            return (
              <g key={`snake-${idx}-${seg.x}-${seg.y}`}>
                <rect
                  x={seg.x + 0.05}
                  y={seg.y + 0.05}
                  width={0.9}
                  height={0.9}
                  rx={0.12}
                  fill="#000000"
                />
                {/* Eyes on head */}
                {isHead && (
                  <>
                    <circle cx={seg.x + 0.3} cy={seg.y + 0.3} r={0.12} fill="#ffffff" />
                    <circle cx={seg.x + 0.7} cy={seg.y + 0.3} r={0.12} fill="#ffffff" />
                  </>
                )}
              </g>
            );
          })}

          {/* Food (Solid black pellet) */}
          <rect
            x={food.x + 0.1}
            y={food.y + 0.1}
            width={0.8}
            height={0.8}
            rx={0.2}
            fill="#000000"
          />
        </svg>

        {/* Start Game Prompt when Idle */}
        {gameStatus === 'IDLE' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
            <div className="text-sm sm:text-base font-mono font-black tracking-widest text-black mb-1">
              READY
            </div>
            <div className="text-[11px] sm:text-xs font-mono font-bold text-zinc-600 tracking-wider animate-pulse">
              TAP ANY ARROW TO START
            </div>
          </div>
        )}

        {/* Minimal Game Over Screen */}
        {gameStatus === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
            <div className="text-xl sm:text-2xl font-mono font-black tracking-widest text-black mb-1">
              GAME OVER
            </div>
            <div className="text-sm font-mono text-zinc-800 font-bold mb-3">
              SCORE: {score}
            </div>
            <div className="text-[11px] sm:text-xs font-mono font-bold text-zinc-600 tracking-wider animate-pulse">
              TAP ANY ARROW TO RETRY
            </div>
          </div>
        )}
      </div>

      {/* 4 BUTTONS FOR ARROWS IN A CROSS LIKE THE CONTROLLER */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 mt-6 select-none">
        {/* UP ARROW (Reversed: moves snake DOWN) */}
        <button
          type="button"
          id="controller-btn-up"
          onClick={() => handleInput('UP')}
          onTouchStart={(e) => {
            e.preventDefault();
            handleInput('UP');
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-zinc-900 border-2 border-zinc-700 active:bg-zinc-700 active:scale-95 flex items-center justify-center text-white cursor-pointer transition-transform shadow-xl hover:border-zinc-500"
          aria-label="Up arrow button"
        >
          <ChevronUp size={34} strokeWidth={2.5} />
        </button>

        {/* LEFT ARROW (Reversed: moves snake RIGHT) */}
        <button
          type="button"
          id="controller-btn-left"
          onClick={() => handleInput('LEFT')}
          onTouchStart={(e) => {
            e.preventDefault();
            handleInput('LEFT');
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-zinc-900 border-2 border-zinc-700 active:bg-zinc-700 active:scale-95 flex items-center justify-center text-white cursor-pointer transition-transform shadow-xl hover:border-zinc-500"
          aria-label="Left arrow button"
        >
          <ChevronLeft size={34} strokeWidth={2.5} />
        </button>

        {/* CENTER PIVOT (Classic D-pad hub) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
        </div>

        {/* RIGHT ARROW (Reversed: moves snake LEFT) */}
        <button
          type="button"
          id="controller-btn-right"
          onClick={() => handleInput('RIGHT')}
          onTouchStart={(e) => {
            e.preventDefault();
            handleInput('RIGHT');
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-zinc-900 border-2 border-zinc-700 active:bg-zinc-700 active:scale-95 flex items-center justify-center text-white cursor-pointer transition-transform shadow-xl hover:border-zinc-500"
          aria-label="Right arrow button"
        >
          <ChevronRight size={34} strokeWidth={2.5} />
        </button>

        {/* DOWN ARROW (Reversed: moves snake UP) */}
        <button
          type="button"
          id="controller-btn-down"
          onClick={() => handleInput('DOWN')}
          onTouchStart={(e) => {
            e.preventDefault();
            handleInput('DOWN');
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-zinc-900 border-2 border-zinc-700 active:bg-zinc-700 active:scale-95 flex items-center justify-center text-white cursor-pointer transition-transform shadow-xl hover:border-zinc-500"
          aria-label="Down arrow button"
        >
          <ChevronDown size={34} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
