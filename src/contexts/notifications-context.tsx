'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { NotificationItem, NotifyOptions } from '@/types/notifications';
import {
  playNotificationSound,
  isSoundEnabled as getSoundEnabledFromStorage,
  setSoundEnabled as setSoundEnabledInStorage,
} from '@/lib/sound';

const MAX_NOTIFICATIONS = 50;

interface NotificationsContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  notify: (options: NotifyOptions) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = useMemo(() => {
    return user?.id ? `clover_notifications_${user.id}` : 'clover_notifications_guest';
  }, [user?.id]);

  // Load notifications and sound settings from localStorage
  useEffect(() => {
    try {
      setSoundEnabledState(getSoundEnabledFromStorage());
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      } else {
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Save notifications to localStorage whenever state changes
  const saveNotifications = useCallback(
    (items: NotificationItem[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch {
        // Handle storage quota errors gracefully
      }
    },
    [storageKey]
  );

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const notify = useCallback(
    ({
      title,
      message,
      type,
      actionType = 'create',
      link,
      amount,
      showToast = true,
      playSound = true,
      toastType = 'success',
    }: NotifyOptions) => {
      const newNotification: NotificationItem = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        message,
        type,
        actionType,
        read: false,
        createdAt: new Date().toISOString(),
        link,
        amount,
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS);
        saveNotifications(updated);
        return updated;
      });

      // 1. Play subtle audio feedback
      if (playSound) {
        const soundMap = {
          create: 'create',
          update: 'update',
          delete: 'delete',
          payment: 'payment',
          contribution: 'contribution',
          info: 'info',
        } as const;
        playNotificationSound(soundMap[actionType] || 'success');
      }

      // 2. Trigger synchronized toast
      if (showToast) {
        const descriptionText = message;
        const resolvedToastType = toastType || (actionType === 'delete' ? 'error' : 'success');
        if (resolvedToastType === 'success') {
          toast.success(title, { description: descriptionText });
        } else if (resolvedToastType === 'error') {
          toast.error(title, { description: descriptionText });
        } else if (resolvedToastType === 'warning') {
          toast.warning(title, { description: descriptionText });
        } else {
          toast.info(title, { description: descriptionText });
        }
      }
    },
    [saveNotifications]
  );

  const markAsRead = useCallback(
    (id: string) => {
      setNotifications((prev) => {
        const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
        saveNotifications(updated);
        return updated;
      });
    },
    [saveNotifications]
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const deleteNotification = useCallback(
    (id: string) => {
      playNotificationSound('delete');
      setNotifications((prev) => {
        const updated = prev.filter((n) => n.id !== id);
        saveNotifications(updated);
        return updated;
      });
    },
    [saveNotifications]
  );

  const clearAll = useCallback(() => {
    playNotificationSound('delete');
    setNotifications([]);
    saveNotifications([]);
  }, [saveNotifications]);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      setSoundEnabledInStorage(next);
      if (next) {
        playNotificationSound('success');
      }
      return next;
    });
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications: isLoaded ? notifications : [],
        unreadCount: isLoaded ? unreadCount : 0,
        notify,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        soundEnabled,
        toggleSound,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
