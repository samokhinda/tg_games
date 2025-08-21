// Типы для Telegram Mini App API
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        expand?: () => void;
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export {};
