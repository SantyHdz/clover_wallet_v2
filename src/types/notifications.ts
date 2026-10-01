export type NotificationCategory =
  | 'transaction'
  | 'debt'
  | 'loan'
  | 'saving'
  | 'category'
  | 'profile'
  | 'system';

export type NotificationActionType =
  | 'create'
  | 'update'
  | 'delete'
  | 'payment'
  | 'contribution'
  | 'info';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationCategory;
  actionType?: NotificationActionType;
  read: boolean;
  createdAt: string; // ISO string
  link?: string;
  amount?: number;
}

export interface NotifyOptions {
  title: string;
  message: string;
  type: NotificationCategory;
  actionType?: NotificationActionType;
  link?: string;
  amount?: number;
  showToast?: boolean;
  playSound?: boolean;
  toastType?: 'success' | 'info' | 'warning' | 'error';
}
