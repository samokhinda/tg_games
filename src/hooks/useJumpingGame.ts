'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'manhole' | 'obstacle' | 'star' | 'hero';
  collected?: boolean;
}

interface GameState {
  hero: Position;
  objects: GameObject[];
  score: number;
  stars: number;
  isPlaying: boolean;
  gameSpeed: number;
  roadOffset: number;
  isJumping: boolean;
  jumpHeight: number;
}

const GAME_WIDTH = 350;
const GAME_HEIGHT = 600;
const HERO_SIZE = 40;
const ROAD_LANES = 3;
const LANE_WIDTH = GAME_WIDTH / ROAD_LANES;
const HERO_SPEED = 8; // Плавное движение для комфорта

export const useJumpingGame = (gyroGamma: number) => {
  const [gameState, setGameState] = useState<GameState>({
    hero: { x: LANE_WIDTH, y: GAME_HEIGHT - 100 }, // Центральная полоса
    objects: [],
    score: 0,
    stars: 0,
    isPlaying: false,
    gameSpeed: 2, // Медленная скорость для детей
    roadOffset: 0,
    isJumping: false,
    jumpHeight: 0,
  });

  const gameLoopRef = useRef<number>();
  const lastObjectSpawn = useRef<number>(0);
  const audioContextRef = useRef<AudioContext>();

  // Инициализация аудио контекста
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.log('Audio context не поддерживается');
      }
    }
  }, []);

  // Воспроизведение звука успеха (простой тон)
  const playSuccessSound = useCallback(() => {
    if (!audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(523.25, audioContextRef.current.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContextRef.current.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContextRef.current.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.5);
      
      // Haptic feedback для Telegram
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    } catch (error) {
      console.log('Ошибка воспроизведения звука:', error);
    }
  }, []);

  // Движение героя на основе гироскопа (плавное и чувствительное)
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const sensitivity = 0.8; // Умеренная чувствительность
    const targetLane = Math.max(0, Math.min(2, Math.floor((gyroGamma + 45) / 30))); // 3 полосы
    const targetX = targetLane * LANE_WIDTH + LANE_WIDTH / 2 - HERO_SIZE / 2;

    setGameState(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        x: prev.hero.x + (targetX - prev.hero.x) * 0.1, // Плавное движение
      }
    }));
  }, [gyroGamma, gameState.isPlaying]);

  // Создание объектов на дороге
  const spawnObject = useCallback((currentTime: number) => {
    if (currentTime - lastObjectSpawn.current < 1500) return; // Интервал 1.5 сек для комфорта

    const objects: GameObject[] = [];
    const lanes = [0, 1, 2];
    
    // Случайно выбираем 1-2 полосы для объектов
    const selectedLanes = lanes.sort(() => Math.random() - 0.5).slice(0, Math.random() > 0.5 ? 2 : 1);
    
    selectedLanes.forEach(lane => {
      const x = lane * LANE_WIDTH + LANE_WIDTH / 2 - 25;
      const isManhole = Math.random() > 0.3; // 70% шанс люка
      
      objects.push({
        id: `${currentTime}-${lane}`,
        x,
        y: -50,
        width: 50,
        height: 20,
        type: isManhole ? 'manhole' : 'obstacle',
      });

      // Добавляем звездочки над люками
      if (isManhole) {
        objects.push({
          id: `star-${currentTime}-${lane}`,
          x: x + 15,
          y: -80,
          width: 20,
          height: 20,
          type: 'star',
        });
      }
    });

    setGameState(prev => ({
      ...prev,
      objects: [...prev.objects, ...objects],
    }));

    lastObjectSpawn.current = currentTime;
  }, []);

  // Проверка коллизий
  const checkCollisions = useCallback(() => {
    setGameState(prev => {
      const newObjects = prev.objects.map(obj => {
        // Проверяем коллизию с героем
        const heroRect = {
          x: prev.hero.x,
          y: prev.hero.y - prev.jumpHeight,
          width: HERO_SIZE,
          height: HERO_SIZE,
        };

        const objRect = {
          x: obj.x,
          y: obj.y,
          width: obj.width,
          height: obj.height,
        };

        const collision = heroRect.x < objRect.x + objRect.width &&
                         heroRect.x + heroRect.width > objRect.x &&
                         heroRect.y < objRect.y + objRect.height &&
                         heroRect.y + heroRect.height > objRect.y;

        if (collision && !obj.collected) {
          if (obj.type === 'manhole' && prev.jumpHeight > 20) {
            // Успешное приземление на люк
            playSuccessSound();
            return { ...obj, collected: true };
          } else if (obj.type === 'star') {
            // Сбор звездочки
            playSuccessSound();
            return { ...obj, collected: true };
          }
        }

        return obj;
      });

      // Подсчет собранных объектов
      const newStars = newObjects.filter(obj => obj.type === 'star' && obj.collected).length;
      const manholeHits = newObjects.filter(obj => obj.type === 'manhole' && obj.collected).length;

      return {
        ...prev,
        objects: newObjects.filter(obj => obj.y < GAME_HEIGHT + 100), // Удаляем объекты за экраном
        stars: prev.stars + (newStars - prev.objects.filter(obj => obj.type === 'star' && obj.collected).length),
        score: prev.score + (manholeHits - prev.objects.filter(obj => obj.type === 'manhole' && obj.collected).length) * 10,
      };
    });
  }, [playSuccessSound]);

  // Прыжок героя (автоматический при приближении к люку)
  const jump = useCallback(() => {
    if (gameState.isJumping) return;

    setGameState(prev => ({ ...prev, isJumping: true, jumpHeight: 0 }));

    const jumpAnimation = () => {
      setGameState(prev => {
        if (prev.jumpHeight >= 60) {
          // Начинаем спуск
          const newHeight = Math.max(0, prev.jumpHeight - 4);
          if (newHeight === 0) {
            return { ...prev, isJumping: false, jumpHeight: 0 };
          }
          return { ...prev, jumpHeight: newHeight };
        } else {
          // Подъем
          return { ...prev, jumpHeight: prev.jumpHeight + 4 };
        }
      });

      if (gameState.isJumping) {
        requestAnimationFrame(jumpAnimation);
      }
    };

    requestAnimationFrame(jumpAnimation);
  }, [gameState.isJumping]);

  // Автоматический прыжок при приближении к люку
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isJumping) return;

    const nearbyManhole = gameState.objects.find(obj => 
      obj.type === 'manhole' && 
      obj.y > GAME_HEIGHT - 150 && 
      obj.y < GAME_HEIGHT - 100 &&
      Math.abs(obj.x - gameState.hero.x) < 30
    );

    if (nearbyManhole) {
      jump();
    }
  }, [gameState.objects, gameState.hero.x, gameState.isPlaying, gameState.isJumping, jump]);

  // Основной игровой цикл
  const gameLoop = useCallback((currentTime: number) => {
    if (!gameState.isPlaying) return;

    // Движение дороги и объектов
    setGameState(prev => ({
      ...prev,
      roadOffset: (prev.roadOffset + prev.gameSpeed) % 100,
      objects: prev.objects.map(obj => ({
        ...obj,
        y: obj.y + prev.gameSpeed,
      })),
    }));

    // Создание новых объектов
    spawnObject(currentTime);
    
    // Проверка коллизий
    checkCollisions();

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, spawnObject, checkCollisions]);

  // Запуск игры
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      score: 0,
      stars: 0,
      objects: [],
      roadOffset: 0,
    }));
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  // Остановка игры
  const stopGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  return {
    gameState,
    startGame,
    stopGame,
    GAME_WIDTH,
    GAME_HEIGHT,
    HERO_SIZE,
  };
};
