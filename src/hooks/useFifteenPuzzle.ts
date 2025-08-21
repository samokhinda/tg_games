import { useState, useCallback, useEffect } from 'react';

export type Tile = number | null;
export type Board = Tile[][];

interface GameState {
  board: Board;
  moves: number;
  isWon: boolean;
  isGameStarted: boolean;
}

// Создаем выигрышную позицию
const createWinningBoard = (): Board => {
  const board: Board = [];
  let num = 1;
  
  for (let i = 0; i < 4; i++) {
    board[i] = [];
    for (let j = 0; j < 4; j++) {
      if (i === 3 && j === 3) {
        board[i][j] = null; // Пустая клетка
      } else {
        board[i][j] = num++;
      }
    }
  }
  
  return board;
};

// Перемешиваем доску
const shuffleBoard = (board: Board): Board => {
  const newBoard = board.map(row => [...row]);
  const tiles = newBoard.flat().filter(tile => tile !== null) as number[];
  
  // Перемешиваем массив чисел
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  
  // Проверяем, что головоломка решаема
  let inversions = 0;
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) {
        inversions++;
      }
    }
  }
  
  // Если количество инверсий четное, головоломка решаема
  if (inversions % 2 !== 0) {
    // Делаем количество инверсий четным
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  }
  
  // Заполняем доску перемешанными числами
  let tileIndex = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i === 3 && j === 3) {
        newBoard[i][j] = null;
      } else {
        newBoard[i][j] = tiles[tileIndex++];
      }
    }
  }
  
  return newBoard;
};

// Находим позицию пустой клетки
const findEmptyTile = (board: Board): [number, number] => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === null) {
        return [i, j];
      }
    }
  }
  return [3, 3]; // fallback
};

// Проверяем, можно ли переместить плитку
const canMoveTile = (board: Board, row: number, col: number): boolean => {
  const [emptyRow, emptyCol] = findEmptyTile(board);
  
  // Проверяем, что плитка соседняя с пустой клеткой
  const isAdjacent = 
    (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
    (Math.abs(col - emptyCol) === 1 && row === emptyRow);
  
  return isAdjacent;
};

// Перемещаем плитку
const moveTile = (board: Board, row: number, col: number): Board => {
  if (!canMoveTile(board, row, col)) {
    return board;
  }
  
  const newBoard = board.map(r => [...r]);
  const [emptyRow, emptyCol] = findEmptyTile(board);
  
  // Меняем местами плитку и пустую клетку
  newBoard[emptyRow][emptyCol] = board[row][col];
  newBoard[row][col] = null;
  
  return newBoard;
};

// Проверяем, выиграл ли игрок
const checkWin = (board: Board): boolean => {
  const winningBoard = createWinningBoard();
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] !== winningBoard[i][j]) {
        return false;
      }
    }
  }
  
  return true;
};

export const useFifteenPuzzle = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const winningBoard = createWinningBoard();
    return {
      board: winningBoard,
      moves: 0,
      isWon: false,
      isGameStarted: false,
    };
  });

  // Новая игра
  const newGame = useCallback(() => {
    const winningBoard = createWinningBoard();
    const shuffledBoard = shuffleBoard(winningBoard);
    
    setGameState({
      board: shuffledBoard,
      moves: 0,
      isWon: false,
      isGameStarted: true,
    });
  }, []);

  // Обработка клика по плитке
  const handleTileClick = useCallback((row: number, col: number) => {
    if (gameState.isWon || !gameState.isGameStarted) {
      return;
    }

    const newBoard = moveTile(gameState.board, row, col);
    
    // Если доска изменилась, значит ход был валидным
    if (newBoard !== gameState.board) {
      const newMoves = gameState.moves + 1;
      const isWon = checkWin(newBoard);
      
      setGameState({
        board: newBoard,
        moves: newMoves,
        isWon,
        isGameStarted: !isWon, // Останавливаем игру при победе
      });
    }
  }, [gameState]);

  // Проверяем, можно ли переместить плитку (для UI)
  const isTileMovable = useCallback((row: number, col: number) => {
    return canMoveTile(gameState.board, row, col);
  }, [gameState.board]);

  return {
    board: gameState.board,
    moves: gameState.moves,
    isWon: gameState.isWon,
    isGameStarted: gameState.isGameStarted,
    newGame,
    handleTileClick,
    isTileMovable,
  };
};
