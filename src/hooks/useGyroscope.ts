'use client';

import { useState, useEffect, useCallback } from 'react';

interface GyroscopeData {
  gamma: number; // Наклон влево-вправо (-90 до 90)
  beta: number;  // Наклон вперед-назад (-180 до 180)
  alpha: number; // Поворот вокруг оси Z (0 до 360)
}

interface UseGyroscopeReturn {
  gyroscopeData: GyroscopeData;
  isSupported: boolean;
  isEnabled: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
}

export const useGyroscope = (): UseGyroscopeReturn => {
  const [gyroscopeData, setGyroscopeData] = useState<GyroscopeData>({
    gamma: 0,
    beta: 0,
    alpha: 0,
  });
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Проверяем поддержку гироскопа
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = 'DeviceOrientationEvent' in window;
      setIsSupported(supported);
      
      if (!supported) {
        setError('Гироскоп не поддерживается на этом устройстве');
      }
    }
  }, []);

  // Обработчик события ориентации устройства
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    setGyroscopeData({
      gamma: event.gamma || 0,  // Наклон влево-вправо
      beta: event.beta || 0,    // Наклон вперед-назад
      alpha: event.alpha || 0,  // Поворот
    });
  }, []);

  // Запрос разрешения и запуск гироскопа
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setError('Гироскоп не поддерживается');
      return;
    }

    try {
      // Для iOS 13+ требуется явное разрешение
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          setError('Разрешение на использование гироскопа отклонено');
          return;
        }
      }

      // Добавляем слушатель событий
      window.addEventListener('deviceorientation', handleOrientation);
      setIsEnabled(true);
      setError(null);
      
      // Для Telegram Mini Apps также можем использовать haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
      
    } catch (err) {
      setError('Ошибка при запуске гироскопа: ' + (err as Error).message);
    }
  }, [isSupported, handleOrientation]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (isEnabled) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [isEnabled, handleOrientation]);

  return {
    gyroscopeData,
    isSupported,
    isEnabled,
    error,
    requestPermission,
  };
};
