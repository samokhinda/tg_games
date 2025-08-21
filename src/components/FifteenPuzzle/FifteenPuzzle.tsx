'use client';

import { Button, Title, Text } from '@telegram-apps/telegram-ui';
import { useFifteenPuzzle, type Tile } from '@/hooks/useFifteenPuzzle';
import './FifteenPuzzle.css';

interface TileProps {
  value: Tile;
  row: number;
  col: number;
  isMovable: boolean;
  onClick: (row: number, col: number) => void;
}

const TileComponent = ({ value, row, col, isMovable, onClick }: TileProps) => {
  const handleClick = () => {
    if (isMovable && value !== null) {
      onClick(row, col);
    }
  };

  if (value === null) {
    return <div className="tile tile--empty" />;
  }

  return (
    <div
      className={`tile ${isMovable ? 'tile--movable' : ''}`}
      onClick={handleClick}
    >
      <span className="tile__number">{value}</span>
    </div>
  );
};

export const FifteenPuzzle = () => {
  const {
    board,
    moves,
    isWon,
    isGameStarted,
    newGame,
    handleTileClick,
    isTileMovable,
  } = useFifteenPuzzle();

  return (
    <div className="fifteen-puzzle">
      <div className="fifteen-puzzle__header">
        <Title level="1" className="fifteen-puzzle__title">
          🧩 Пятнашки
        </Title>
        
        <div className="fifteen-puzzle__stats">
          <Text className="fifteen-puzzle__moves">
            Ходов: {moves}
          </Text>
          
          {isWon && (
            <Text className="fifteen-puzzle__win-message">
              🎉 Поздравляем! Вы выиграли! 🎉
            </Text>
          )}
        </div>
        
        <Button
          size="m"
          onClick={newGame}
          className="fifteen-puzzle__new-game-btn"
        >
          {isGameStarted ? 'Новая игра' : 'Начать игру'}
        </Button>
      </div>

      <div className="fifteen-puzzle__board">
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <TileComponent
              key={`${rowIndex}-${colIndex}`}
              value={tile}
              row={rowIndex}
              col={colIndex}
              isMovable={isTileMovable(rowIndex, colIndex)}
              onClick={handleTileClick}
            />
          ))
        )}
      </div>

      {!isGameStarted && !isWon && (
        <div className="fifteen-puzzle__instructions">
          <Text style={{ 
            textAlign: 'center', 
            color: 'var(--tg-theme-hint-color)',
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            Нажмите "Начать игру", чтобы перемешать плитки.
            <br />
            Цель: расположить числа от 1 до 15 по порядку.
            <br />
            Кликайте по плиткам рядом с пустым местом, чтобы их переместить.
          </Text>
        </div>
      )}
    </div>
  );
};
