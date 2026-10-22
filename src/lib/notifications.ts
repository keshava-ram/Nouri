'use client';

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    } catch (e) {
      console.error('Failed to trigger notification:', e);
    }
  }
}

export function triggerWaterReminder(currentConsumedMl: number, targetMl: number, climateAdvice?: string) {
  const remaining = Math.max(0, targetMl - currentConsumedMl);
  const title = '💧 Nouri Hydration Reminder';
  const body = remaining > 0
    ? `You have drank ${currentConsumedMl}ml so far. Drink a glass (250ml) to stay on track! ${climateAdvice || ''}`
    : 'Great job! You reached your daily hydration target. Keep taking small sips if active.';

  sendLocalNotification(title, { body });
}

export function triggerMealReminder(mealType: string) {
  const title = `🍽️ Time for ${mealType}!`;
  const body = `Open Nouri to check your remaining protein & macro targets for today.`;
  sendLocalNotification(title, { body });
}
