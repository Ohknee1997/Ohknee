import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Play,
  Check,
  Delete,
  Flame,
} from 'lucide-react';

const GRID_SIZE = 20;
const TICK_SPEED_MS = 130;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };
type GameStatus = 'IDLE' | 'PLAYING' | 'GAME_OVER' | 'NAME_ENTRY' | 'LEADERBOARD';

export interface SnakeLeaderboardEntry {
  id: string;
  name: string; // Max 10 characters
  score: number;
  date: string;
}

const DEFAULT_LEADERBOARD: SnakeLeaderboardEntry[] = [
  { id: '1', name: 'OHKNEE', score: 25, date: '09/13' },
  { id: '2', name: 'SNAKEGOD', score: 18, date: '09/12' },
  { id: '3', name: 'REVERSEPRO', score: 14, date: '09/11' },
  { id: '4', name: 'PILOT99', score: 10, date: '09/10' },
  { id: '5', name: 'BIGDOG', score: 7, date: '09/09' },
  { id: '6', name: 'NOOBCRUSH', score: 5, date: '09/08' },
  { id: '7', name: 'NEWBIE', score: 3, date: '09/07' },
];

const ARCADE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 _-!*';

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

  // Leaderboard state persisted in localStorage
  const [leaderboard, setLeaderboard] = useState<SnakeLeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('ohknee_snake_leaderboard_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_LEADERBOARD;
  });

  // Track highest all-time score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = parseInt(localStorage.getItem('ohknee_snake_highscore') || '0', 10);
      const topLeaderboard = DEFAULT_LEADERBOARD[0]?.score || 0;
      return Math.max(saved, topLeaderboard);
    } catch {
      return 25;
    }
  });

  // Old-school flashing letters name entry state (10 characters max)
  const [nameChars, setNameChars] = useState<string[]>(['A', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
  const [activeCharIndex, setActiveCharIndex] = useState<number>(0);
  const [cursorBlink, setCursorBlink] = useState<boolean>(true);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

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

  // Flashing letters cursor blink loop during name entry
  useEffect(() => {
    if (gameStatus !== 'NAME_ENTRY') return;
    const blinkInterval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 320);
    return () => clearInterval(blinkInterval);
  }, [gameStatus]);

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

  // Arcade name entry operations
  const cycleChar = useCallback((dir: 'NEXT' | 'PREV') => {
    setNameChars((prev) => {
      const next = [...prev];
      const cur = next[activeCharIndex] || 'A';
      let idx = ARCADE_CHARS.indexOf(cur);
      if (idx === -1) idx = 0;
      if (dir === 'NEXT') {
        idx = (idx + 1) % ARCADE_CHARS.length;
      } else {
        idx = (idx - 1 + ARCADE_CHARS.length) % ARCADE_CHARS.length;
      }
      next[activeCharIndex] = ARCADE_CHARS[idx];
      return next;
    });
    playBip(680, 0.03);
  }, [activeCharIndex, playBip]);

  const moveCursor = useCallback((dir: 'LEFT' | 'RIGHT') => {
    setActiveCharIndex((prev) => {
      if (dir === 'RIGHT') return Math.min(9, prev + 1);
      return Math.max(0, prev - 1);
    });
    playBip(520, 0.02);
  }, [playBip]);

  const deleteCurrentChar = useCallback(() => {
    setNameChars((prev) => {
      const next = [...prev];
      next[activeCharIndex] = ' ';
      return next;
    });
    setActiveCharIndex((prev) => Math.max(0, prev - 1));
    playBip(380, 0.03);
  }, [activeCharIndex, playBip]);

  const submitScoreToLeaderboard = useCallback(() => {
    const entered = nameChars.join('').trim() || 'ANON';
    const cleanName = entered.slice(0, 10).toUpperCase();
    const finalScore = scoreRef.current;

    const newEntry: SnakeLeaderboardEntry = {
      id: Date.now().toString(),
      name: cleanName,
      score: finalScore,
      date: new Date().toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }),
    };

    setLeaderboard((prev) => {
      const updated = [...prev, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      try {
        localStorage.setItem('ohknee_snake_leaderboard_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        localStorage.setItem('ohknee_snake_highscore', String(finalScore));
      } catch {}
    }

    setJustSavedId(newEntry.id);
    playBip(940, 0.12);
    statusRef.current = 'LEADERBOARD';
    setGameStatus('LEADERBOARD');
  }, [highScore, nameChars, playBip]);

  // Direction handler with REVERSED mappings:
  // User intended UP    -> Actual movement is DOWN
  // User intended DOWN  -> Actual movement is UP
  // User intended LEFT  -> Actual movement is RIGHT
  // User intended RIGHT -> Actual movement is LEFT
  const applyDirection = useCallback(
    (actualDir: Direction) => {
      // If in LEADERBOARD, start new game
      if (statusRef.current === 'LEADERBOARD') {
        statusRef.current = 'IDLE';
        setGameStatus('IDLE');
      }

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
      // In NAME_ENTRY mode, D-pad acts as character selector & cursor mover!
      if (statusRef.current === 'NAME_ENTRY') {
        if (intended === 'UP') cycleChar('NEXT');
        else if (intended === 'DOWN') cycleChar('PREV');
        else if (intended === 'RIGHT') moveCursor('RIGHT');
        else if (intended === 'LEFT') moveCursor('LEFT');
        return;
      }

      // Apply the reversal during gameplay!
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
    [applyDirection, cycleChar, moveCursor]
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

  const enterNameEntryMode = useCallback(() => {
    setNameChars(['A', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
    setActiveCharIndex(0);
    statusRef.current = 'NAME_ENTRY';
    setGameStatus('NAME_ENTRY');
    playBip(750, 0.08);
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
        handleGameOver();
        return;
      }

      // 2. Self collision
      const curFood = foodRef.current;
      const willEat = head.x === curFood.x && head.y === curFood.y;
      const bodySegmentsToCheck = willEat ? curSnake : curSnake.slice(0, -1);

      if (bodySegmentsToCheck.some((seg) => seg.x === head.x && seg.y === head.y)) {
        handleGameOver();
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

    const handleGameOver = () => {
      playBip(160, 0.25);
      const finalScore = scoreRef.current;
      const isNewHighScore = finalScore > highScore && finalScore > 0;

      // If user broke high score, automatically enter flashing name entry mode!
      if (isNewHighScore) {
        setNameChars(['A', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
        setActiveCharIndex(0);
        statusRef.current = 'NAME_ENTRY';
        setGameStatus('NAME_ENTRY');
      } else {
        statusRef.current = 'GAME_OVER';
        setGameStatus('GAME_OVER');
      }
    };

    return () => clearInterval(timer);
  }, [getRandomFood, highScore, playBip]);

  // Keyboard controls listener (Supports both gameplay and arcade name typing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // In NAME_ENTRY mode: type characters directly or navigate
      if (statusRef.current === 'NAME_ENTRY') {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitScoreToLeaderboard();
          return;
        }
        if (e.key === 'Backspace') {
          e.preventDefault();
          deleteCurrentChar();
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          moveCursor('RIGHT');
          return;
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          moveCursor('LEFT');
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          cycleChar('NEXT');
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          cycleChar('PREV');
          return;
        }

        // Direct key typing (A-Z, 0-9, space, hyphen, underscore)
        if (e.key.length === 1) {
          const upper = e.key.toUpperCase();
          if (ARCADE_CHARS.includes(upper)) {
            e.preventDefault();
            setNameChars((prev) => {
              const next = [...prev];
              next[activeCharIndex] = upper;
              return next;
            });
            setActiveCharIndex((prev) => Math.min(9, prev + 1));
            playBip(720, 0.02);
          }
        }
        return;
      }

      // In gameplay mode:
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
  }, [
    activeCharIndex,
    cycleChar,
    deleteCurrentChar,
    handleInput,
    moveCursor,
    playBip,
    resetToIdle,
    submitScoreToLeaderboard,
  ]);

  const isBrokeRecord = score > highScore && score > 0;

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-sm sm:max-w-md mx-auto py-3 px-3 select-none pb-24">
      {/* Minimal Score, Leaderboard & Reset Bar */}
      <div className="w-full max-w-[350px] sm:max-w-[400px] flex items-center justify-between font-mono text-xs text-zinc-400 mb-2 px-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <span>
            SCORE: <strong className="text-white font-bold">{score}</strong>
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <Trophy size={11} />
            <span>BEST: {highScore}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Toggle Leaderboard */}
          <button
            type="button"
            id="toggle-leaderboard-btn"
            onClick={() => {
              if (gameStatus === 'LEADERBOARD') {
                statusRef.current = 'IDLE';
                setGameStatus('IDLE');
              } else {
                statusRef.current = 'LEADERBOARD';
                setGameStatus('LEADERBOARD');
              }
              playBip(600, 0.04);
            }}
            className={`flex items-center gap-1 cursor-pointer py-1 px-2 rounded text-[11px] font-mono font-bold border transition-colors ${
              gameStatus === 'LEADERBOARD'
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-zinc-900/80 text-zinc-300 hover:text-white border-zinc-700 hover:border-zinc-500'
            }`}
            title="Toggle Leaderboard"
          >
            <Trophy size={12} />
            <span>{gameStatus === 'LEADERBOARD' ? 'GAME' : 'SCORES'}</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={resetToIdle}
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded bg-zinc-900/60 border border-zinc-800 text-[11px]"
            title="Reset"
          >
            <RotateCcw size={12} />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* BARE-BONES WHITE SCREEN (NOKIA / RETRO ARCADE STYLE) */}
      <div
        id="snake-white-screen"
        onClick={() => {
          if (gameStatus === 'IDLE') {
            applyDirection('UP');
          }
        }}
        className="relative w-full aspect-square max-w-[350px] sm:max-w-[400px] bg-white border-4 border-zinc-600 rounded shadow-2xl overflow-hidden flex items-center justify-center select-none"
      >
        {/* GAMEPLAY DISPLAY */}
        {(gameStatus === 'IDLE' || gameStatus === 'PLAYING' || gameStatus === 'GAME_OVER') && (
          <svg
            viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`}
            className="w-full h-full bg-white block"
            style={{ imageRendering: 'pixelated' }}
          >
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
        )}

        {/* Start Game Prompt when Idle */}
        {gameStatus === 'IDLE' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center cursor-pointer">
            <div className="text-sm sm:text-base font-mono font-black tracking-widest text-black mb-1">
              READY
            </div>
            <div className="text-[11px] sm:text-xs font-mono font-bold text-zinc-600 tracking-wider animate-pulse">
              TAP ARROW TO START
            </div>
          </div>
        )}

        {/* Game Over Screen with option to save name */}
        {gameStatus === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
            <div className="text-xl sm:text-2xl font-mono font-black tracking-widest text-black mb-1">
              GAME OVER
            </div>
            <div className="text-sm font-mono text-zinc-900 font-bold mb-3">
              SCORE: <span className="text-red-600 font-black">{score}</span>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-[220px]">
              {score > 0 && (
                <button
                  type="button"
                  id="game-over-save-name-btn"
                  onClick={enterNameEntryMode}
                  className="w-full py-2 px-3 rounded bg-black text-white font-mono font-black text-xs tracking-wider uppercase hover:bg-zinc-800 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 animate-bounce cursor-pointer"
                >
                  <Trophy size={14} className="text-amber-400" />
                  <span>SAVE YOUR NAME</span>
                </button>
              )}

              <button
                type="button"
                id="game-over-retry-btn"
                onClick={resetToIdle}
                className="w-full py-2 px-3 rounded bg-zinc-100 text-zinc-800 border border-zinc-300 font-mono font-bold text-xs tracking-wider uppercase hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer"
              >
                TAP ANY ARROW TO RETRY
              </button>

              <button
                type="button"
                onClick={() => {
                  statusRef.current = 'LEADERBOARD';
                  setGameStatus('LEADERBOARD');
                }}
                className="text-[11px] font-mono text-zinc-600 hover:text-black font-semibold underline underline-offset-2 cursor-pointer mt-1"
              >
                VIEW HIGH SCORES
              </button>
            </div>
          </div>
        )}

        {/* =======================================================================
            OLD SCHOOL FLASHING LETTERS NAME ENTRY (10 DIGITS MAX)
            ======================================================================= */}
        {gameStatus === 'NAME_ENTRY' && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-between p-3 sm:p-4 text-center select-none font-mono">
            {/* Header: High Score notice */}
            <div className="w-full pt-1">
              {isBrokeRecord ? (
                <div className="flex items-center justify-center gap-1 text-red-600 font-black text-xs sm:text-sm tracking-widest animate-pulse">
                  <Flame size={15} />
                  <span>★ NEW HIGH SCORE! ★</span>
                  <Flame size={15} />
                </div>
              ) : (
                <div className="text-zinc-900 font-black text-xs sm:text-sm tracking-widest uppercase">
                  ENTER YOUR INITIALS
                </div>
              )}
              <div className="text-[11px] font-bold text-zinc-600 mt-0.5">
                FINAL SCORE: <strong className="text-black font-black">{score}</strong> (10 CHARS MAX)
              </div>
            </div>

            {/* Old-School Flashing Letters Slot Display */}
            <div className="my-auto w-full flex flex-col items-center justify-center py-2">
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full max-w-[320px] px-1">
                {nameChars.map((ch, idx) => {
                  const isActive = idx === activeCharIndex;
                  const isFlashingInverted = isActive && cursorBlink;

                  return (
                    <button
                      key={`slot-${idx}`}
                      type="button"
                      id={`char-slot-${idx}`}
                      onClick={() => {
                        setActiveCharIndex(idx);
                        playBip(580, 0.02);
                      }}
                      className={`w-6 h-8 sm:w-7 sm:h-9 rounded flex items-center justify-center text-sm sm:text-base font-black transition-all cursor-pointer border-2 ${
                        isActive
                          ? isFlashingInverted
                            ? 'bg-black text-white border-black scale-105 shadow-md ring-2 ring-red-500/50'
                            : 'bg-zinc-200 text-black border-zinc-900'
                          : 'bg-zinc-50 text-zinc-900 border-zinc-300 hover:border-zinc-500'
                      }`}
                      title={`Character slot ${idx + 1}`}
                    >
                      {ch === ' ' || ch === '' ? (
                        <span className={isActive && isFlashingInverted ? 'text-white' : 'text-zinc-300'}>
                          _
                        </span>
                      ) : (
                        ch
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mini Flashing Arcade Helper & Cyclers */}
              <div className="flex items-center justify-center gap-2 mt-3 w-full">
                <button
                  type="button"
                  id="name-prev-char-btn"
                  onClick={() => cycleChar('PREV')}
                  className="px-2 py-1 bg-zinc-100 border border-zinc-300 rounded text-[11px] font-bold text-zinc-800 hover:bg-zinc-200 active:scale-95 cursor-pointer"
                  title="Previous letter"
                >
                  ▼ PREV
                </button>

                <div className="text-[11px] font-bold text-zinc-500 uppercase">
                  SLOT {activeCharIndex + 1}/10
                </div>

                <button
                  type="button"
                  id="name-next-char-btn"
                  onClick={() => cycleChar('NEXT')}
                  className="px-2 py-1 bg-zinc-100 border border-zinc-300 rounded text-[11px] font-bold text-zinc-800 hover:bg-zinc-200 active:scale-95 cursor-pointer"
                  title="Next letter"
                >
                  ▲ NEXT
                </button>
              </div>

              {/* Cursor step & delete controls */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  type="button"
                  id="name-cursor-left-btn"
                  onClick={() => moveCursor('LEFT')}
                  className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-[10px] font-bold text-zinc-700 hover:bg-zinc-200 active:scale-95 cursor-pointer"
                >
                  ◀ BACK
                </button>
                <button
                  type="button"
                  id="name-del-char-btn"
                  onClick={deleteCurrentChar}
                  className="px-2 py-0.5 bg-red-50 border border-red-300 text-red-700 rounded text-[10px] font-bold hover:bg-red-100 active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <Delete size={11} />
                  <span>DEL</span>
                </button>
                <button
                  type="button"
                  id="name-cursor-right-btn"
                  onClick={() => moveCursor('RIGHT')}
                  className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-[10px] font-bold text-zinc-700 hover:bg-zinc-200 active:scale-95 cursor-pointer"
                >
                  FWD ▶
                </button>
              </div>
            </div>

            {/* Bottom: Save Button */}
            <div className="w-full pb-1">
              <button
                type="button"
                id="submit-arcade-score-btn"
                onClick={submitScoreToLeaderboard}
                className="w-full py-2.5 px-4 rounded bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check size={16} strokeWidth={3} />
                <span>SAVE TO LEADERBOARD</span>
              </button>
              <div className="text-[10px] text-zinc-500 font-bold mt-1">
                USE D-PAD, BUTTONS, OR TYPE ON KEYBOARD
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            HIGH SCORE LEADERBOARD TABLE DISPLAY
            ======================================================================= */}
        {gameStatus === 'LEADERBOARD' && (
          <div className="absolute inset-0 bg-white flex flex-col justify-between p-3 sm:p-4 text-zinc-950 font-mono select-none">
            {/* Table Header */}
            <div className="border-b-2 border-black pb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy size={16} className="text-amber-500" />
                <span className="font-black text-xs sm:text-sm tracking-widest uppercase">
                  HIGH SCORE BOARD
                </span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500">TOP 10</span>
            </div>

            {/* High Scores List */}
            <div className="flex-1 overflow-y-auto my-1.5 pr-1 space-y-1 [scrollbar-width:thin]">
              <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase px-1 border-b border-zinc-200 pb-0.5">
                <span className="w-6">RNK</span>
                <span className="flex-1 text-left pl-2">NAME</span>
                <span className="w-12 text-right">SCORE</span>
                <span className="w-12 text-right">DATE</span>
              </div>

              {leaderboard.map((entry, idx) => {
                const isRank1 = idx === 0;
                const isJustSaved = entry.id === justSavedId;

                return (
                  <div
                    key={entry.id || `entry-${idx}`}
                    className={`flex items-center justify-between text-xs py-1 px-1.5 rounded transition-colors ${
                      isJustSaved
                        ? 'bg-amber-100 border border-amber-400 font-black text-black animate-pulse'
                        : idx % 2 === 0
                        ? 'bg-zinc-100/80 font-bold'
                        : 'bg-white font-medium'
                    }`}
                  >
                    <span className="w-6 flex items-center gap-0.5 font-black text-[11px]">
                      {isRank1 ? '👑' : `${idx + 1}.`}
                    </span>
                    <span className="flex-1 text-left pl-2 truncate tracking-wider font-mono font-black">
                      {entry.name}
                      {isJustSaved && <span className="text-[9px] text-red-600 ml-1">◄ YOU</span>}
                    </span>
                    <span className="w-12 text-right font-black text-zinc-900">{entry.score}</span>
                    <span className="w-12 text-right text-[10px] text-zinc-500">{entry.date}</span>
                  </div>
                );
              })}
            </div>

            {/* Leaderboard Action Controls */}
            <div className="pt-1.5 border-t border-zinc-200 flex items-center gap-2">
              <button
                type="button"
                id="leaderboard-play-again-btn"
                onClick={() => {
                  statusRef.current = 'IDLE';
                  setGameStatus('IDLE');
                  playBip(520, 0.05);
                }}
                className="flex-1 py-2 px-3 rounded bg-black hover:bg-zinc-800 active:scale-95 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Play size={13} fill="currentColor" />
                <span>PLAY GAME</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('ohknee_snake_leaderboard_v2');
                    localStorage.removeItem('ohknee_snake_highscore');
                  } catch {}
                  setLeaderboard(DEFAULT_LEADERBOARD);
                  setHighScore(25);
                  playBip(400, 0.05);
                }}
                className="py-2 px-2.5 rounded bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-700 text-[10px] font-bold border border-zinc-300 cursor-pointer"
                title="Reset to default arcade scores"
              >
                RESET
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4 BUTTONS FOR ARROWS IN A CROSS (CONTROLLER) */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 mt-6 select-none">
        {/* UP ARROW (Reversed: moves snake DOWN; in name entry: cycles char next) */}
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

        {/* LEFT ARROW (Reversed: moves snake RIGHT; in name entry: moves cursor left) */}
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

        {/* CENTER PIVOT (Classic D-pad hub - can also submit in name entry) */}
        <button
          type="button"
          onClick={() => {
            if (statusRef.current === 'NAME_ENTRY') {
              submitScoreToLeaderboard();
            }
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          title={gameStatus === 'NAME_ENTRY' ? 'Submit' : 'D-pad center'}
        >
          {gameStatus === 'NAME_ENTRY' ? (
            <Check size={14} className="text-emerald-400" strokeWidth={3} />
          ) : (
            <div className="w-3 h-3 rounded-full bg-zinc-800" />
          )}
        </button>

        {/* RIGHT ARROW (Reversed: moves snake LEFT; in name entry: moves cursor right) */}
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

        {/* DOWN ARROW (Reversed: moves snake UP; in name entry: cycles char prev) */}
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
