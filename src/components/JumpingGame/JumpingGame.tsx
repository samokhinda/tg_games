'use client';

import { useEffect, useState } from 'react';
import { Button, Title, Text } from '@telegram-apps/telegram-ui';
import { useGyroscope } from '@/hooks/useGyroscope';
import { useJumpingGame } from '@/hooks/useJumpingGame';
import './JumpingGame.css';

interface StarEffectProps {
  x: number;
  y: number;
  id: string;
}

const StarEffect = ({ x, y }: StarEffectProps) => (
  <div 
    className="star-effect" 
    style={{ 
      left: x, 
      top: y,
      animation: 'starCollect 0.8s ease-out forwards'
    }}
  >
    ⭐
  </div>
);

export const JumpingGame = () => {
  const { gyroscopeData, isSupported, isEnabled, error, requestPermission } = useGyroscope();
  const { gameState, startGame, stopGame, GAME_WIDTH, GAME_HEIGHT, HERO_SIZE } = useJumpingGame(gyroscopeData.gamma);
  const [starEffects, setStarEffects] = useState<StarEffectProps[]>([]);
  const [showEncouragement, setShowEncouragement] = useState(false);

  // Показываем поощрительные сообщения
  useEffect(() => {
    if (gameState.stars > 0 && gameState.stars % 5 === 0) {
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 2000);
    }
  }, [gameState.stars]);

  // Эффекты звездочек при сборе
  useEffect(() => {
    const collectedStars = gameState.objects.filter(obj => 
      obj.type === 'star' && obj.collected
    );
    
    collectedStars.forEach(star => {
      if (!starEffects.find(effect => effect.id === star.id)) {
        setStarEffects(prev => [...prev, {
          x: star.x,
          y: star.y,
          id: star.id,
        }]);
        
        setTimeout(() => {
          setStarEffects(prev => prev.filter(effect => effect.id !== star.id));
        }, 800);
      }
    });
  }, [gameState.objects, starEffects]);

  const handleStartGame = async () => {
    if (!isEnabled) {
      await requestPermission();
    }
    startGame();
    
    // Включаем полноэкранный режим в Telegram
    if (window.Telegram?.WebApp?.expand) {
      window.Telegram.WebApp.expand();
    }
  };

  const encouragementMessages = [
    "🌟 Отлично! Продолжай!",
    "🎉 Ты молодец!",
    "✨ Замечательно!",
    "🏆 Супер результат!",
    "💫 Ты звезда!",
  ];

  const currentEncouragement = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

  return (
    <div className="jumping-game">
      <div className="jumping-game__header">
        <Title level="1" className="jumping-game__title">
          🏃‍♂️ Прыгающий Герой
        </Title>
        
        <div className="jumping-game__stats">
          <div className="stat-card">
            <Text className="stat-label">Звездочки</Text>
            <Text className="stat-value">⭐ {gameState.stars}</Text>
          </div>
          <div className="stat-card">
            <Text className="stat-label">Очки</Text>
            <Text className="stat-value">🏆 {gameState.score}</Text>
          </div>
        </div>

        {showEncouragement && (
          <div className="encouragement-message">
            <Text className="encouragement-text">{currentEncouragement}</Text>
          </div>
        )}
      </div>

      {!isSupported && (
        <div className="error-message">
          <Text>❌ Гироскоп не поддерживается на этом устройстве</Text>
        </div>
      )}

      {error && (
        <div className="error-message">
          <Text>⚠️ {error}</Text>
        </div>
      )}

      {!gameState.isPlaying && (
        <div className="game-controls">
          <Button
            size="l"
            onClick={handleStartGame}
            className="start-button"
            disabled={!isSupported}
          >
            {isEnabled ? '🎮 Играть!' : '📱 Включить гироскоп'}
          </Button>
          
          <div className="instructions">
            <Text className="instruction-text">
              🎯 <strong>Как играть:</strong>
            </Text>
            <Text className="instruction-item">
              📱 Наклоняй телефон влево и вправо
            </Text>
            <Text className="instruction-item">
              🕳️ Прыгай на дорожные люки
            </Text>
            <Text className="instruction-item">
              ⭐ Собирай звездочки и слушай музыку!
            </Text>
          </div>
        </div>
      )}

      {gameState.isPlaying && (
        <div className="game-container" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
          {/* Дорога */}
          <div className="road" style={{ transform: `translateY(${gameState.roadOffset}px)` }}>
            {Array.from({ length: Math.ceil(GAME_HEIGHT / 50) + 2 }, (_, i) => (
              <div key={i} className="road-marking" style={{ top: i * 50 - 50 }} />
            ))}
          </div>

          {/* Полосы дороги */}
          <div className="road-lanes">
            <div className="lane-divider" style={{ left: GAME_WIDTH / 3 }} />
            <div className="lane-divider" style={{ left: (GAME_WIDTH / 3) * 2 }} />
          </div>

          {/* Объекты на дороге */}
          {gameState.objects.map(obj => (
            <div
              key={obj.id}
              className={`game-object ${obj.type} ${obj.collected ? 'collected' : ''}`}
              style={{
                left: obj.x,
                top: obj.y,
                width: obj.width,
                height: obj.height,
              }}
            >
              {obj.type === 'manhole' && '🕳️'}
              {obj.type === 'obstacle' && '🚧'}
              {obj.type === 'star' && !obj.collected && '⭐'}
            </div>
          ))}

          {/* Герой */}
          <div
            className={`hero ${gameState.isJumping ? 'jumping' : ''}`}
            style={{
              left: gameState.hero.x,
              top: gameState.hero.y - gameState.jumpHeight,
              width: HERO_SIZE,
              height: HERO_SIZE,
            }}
          >
            👦
          </div>

          {/* Эффекты звездочек */}
          {starEffects.map(effect => (
            <StarEffect key={effect.id} {...effect} />
          ))}

          {/* Кнопка остановки */}
          <Button
            size="s"
            onClick={stopGame}
            className="stop-button"
          >
            ⏹️ Стоп
          </Button>
        </div>
      )}

      {/* Показатель наклона для отладки */}
      {isEnabled && (
        <div className="gyro-debug">
          <Text style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>
            📱 Наклон: {Math.round(gyroscopeData.gamma)}°
          </Text>
        </div>
      )}
    </div>
  );
};
