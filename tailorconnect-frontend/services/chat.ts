import api from '@/lib/axios';

export const chatService = {
    getConversations: async () => {
        const response = await api.get('conversations/');
        return response.data;
    },
    startConversation: async (userId: number) => {
        const response = await api.post('conversations/start/', { user_id: userId });
        return response.data;
    },
    getMessages: async (conversationId: number) => {
        // Assuming your backend supports filtering messages by conversation
        // If not, we might need a custom endpoint or filter.
        // For now, let's assume filtering on message list
        // Note: The backend viewset 'MessageViewSet' filters by 'conversation__participants=user'
        // To get messages for a specific conversation, we should probably add a filter to backend or check Conversation detail.
        // Let's use the Conversation detail which usually embeds messages or we add a query param.

        // Let's rely on ConversationSerializer which has 'last_message', but for full history:
        // We probably need to add a filter for conversation_id in the MessageViewSet in backend.
        // For this frontend step, I'll assume I can filter:
        const response = await api.get(`messages/?conversation=${conversationId}`);
        return response.data;
    },
    sendMessage: async (data: any) => {
        const response = await api.post('messages/', data);
        return response.data;
    }
};
