'use client';

import { backButton } from '@telegram-apps/sdk-react';
import { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Page({ children, back = true }: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   * @default true
   */
  back?: boolean
}>) {
  const router = useRouter();

  useEffect(() => {
    // Проверяем, что мы в браузере и backButton доступен
    if (typeof window === 'undefined') return;
    
    try {
      // Проверяем доступность backButton методов через try-catch
      if (back) {
        backButton.show();
      } else {
        backButton.hide();
      }
    } catch (error) {
      console.warn('BackButton API not available:', error);
    }
  }, [back]);

  useEffect(() => {
    // Проверяем, что мы в браузере и backButton доступен
    if (typeof window === 'undefined') return;
    
    try {
      return backButton.onClick(() => {
        router.back();
      });
    } catch (error) {
      console.warn('BackButton onClick not available:', error);
    }
  }, [router]);

  return <>{children}</>;
}