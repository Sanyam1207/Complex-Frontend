// services/chatService.js
import api from "@/lib/axios";

export const ChatService = {
  // Get all chats for the current user
  getChats: async () => {
    try {
      const response = await api.get('/api/chats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single chat with all messages
  getChat: async (chatId: string) => {
    try {
      const response = await api.get(`/api/chats/${chatId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Start a new chat
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startChat: async (receiverId: any, initialMessage: any, rentalPropertyId = null, image = null) => {
    try {
      const response = await api.post('/api/chats', {
        receiverId,
        initialMessage,
        rentalPropertyId,
        image
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send a message to an existing chat
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendMessage: async (chatId: any, content: any, image = null) => {
    try {
      const response = await api.post(`/api/chats/${chatId}/messages`, {
        content,
        image
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark chat as read
  markAsRead: async (chatId: string) => {
    try {
      const response = await api.put(`/api/chats/${chatId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get unread message count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/api/chats/unread');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};