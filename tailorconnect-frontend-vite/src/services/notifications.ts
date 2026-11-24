import api from '@/lib/axios';

export interface Notification {
    id: number;
    actor_username: string;
    actor_avatar: string | null;
    verb: string;
    notification_type: 'message' | 'review' | 'order';
    target_id: string;
    is_read: boolean;
    created_at: string;
}

export const notificationService = {
    getAll: async () => {
        const response = await api.get('notifications/');
        return response.data;
    },
    getUnreadCount: async () => {
        const response = await api.get('notifications/unread_count/');
        return response.data.unread_count;
    },
    markAsRead: async (id: number) => {
        const response = await api.post(`notifications/${id}/mark_as_read/`);
        return response.data;
    },
    markAllAsRead: async () => {
        const response = await api.post('notifications/mark_all_as_read/');
        return response.data;
    }
};
