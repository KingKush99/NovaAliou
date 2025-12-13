import { create } from 'zustand';

const useChatStore = create((set, get) => ({
    // Conversations
    conversations: [],
    activeConversation: null,

    // Messages
    messages: {},

    // Typing indicators
    typingUsers: {},

    // Initialize conversations
    setConversations: (conversations) => set({ conversations }),

    // Initialize specific conversation (fix for navigation)
    initializeConversation: (conversationId, data) => set((state) => {
        const exists = state.conversations.find(c => c.id === conversationId);
        if (!exists) {
            return {
                conversations: [...state.conversations, {
                    id: conversationId,
                    name: data.name,
                    avatar: data.avatar,
                    isOnline: data.isOnline,
                    unreadCount: 0,
                    lastMessage: '',
                    lastMessageTime: new Date()
                }],
                activeConversation: conversationId
            };
        }
        return { activeConversation: conversationId };
    }),

    // Set active conversation
    setActiveConversation: (conversationId) => set({
        activeConversation: conversationId
    }),

    // Add message
    addMessage: (conversationId, message) => set((state) => {
        const conversationMessages = state.messages[conversationId] || [];

        return {
            messages: {
                ...state.messages,
                [conversationId]: [...conversationMessages, {
                    ...message,
                    id: Date.now(),
                    timestamp: new Date()
                }]
            },
            conversations: state.conversations.map(conv =>
                conv.id === conversationId
                    ? {
                        ...conv,
                        lastMessage: message.text,
                        lastMessageTime: new Date(),
                        unreadCount: conv.id === state.activeConversation ? 0 : (conv.unreadCount || 0) + 1
                    }
                    : conv
            )
        };
    }),

    // Load messages for conversation
    loadMessages: (conversationId, messages) => set((state) => ({
        messages: {
            ...state.messages,
            [conversationId]: messages
        }
    })),

    // Mark as read
    markAsRead: (conversationId) => set((state) => ({
        conversations: state.conversations.map(conv =>
            conv.id === conversationId
                ? { ...conv, unreadCount: 0 }
                : conv
        )
    })),

    // Set typing indicator
    setTyping: (conversationId, userId, isTyping) => set((state) => ({
        typingUsers: {
            ...state.typingUsers,
            [conversationId]: isTyping ? userId : null
        }
    })),

    // Multi-Window Chat State
    openWindows: [], // Array of conversation IDs

    openChatWindow: (conversationId) => set((state) => {
        if (!state.openWindows.includes(conversationId)) {
            return {
                openWindows: [...state.openWindows, conversationId],
                // Optionally limit to 3 windows max for performance
                // openWindows: [...state.openWindows.slice(-2), conversationId] 
            };
        }
        return {};
    }),

    closeChatWindow: (conversationId) => set((state) => ({
        openWindows: state.openWindows.filter(id => id !== conversationId)
    })),

    bringToFront: (conversationId) => set((state) => {
        // Move to end of array to render on top
        if (state.openWindows.includes(conversationId)) {
            return {
                openWindows: [
                    ...state.openWindows.filter(id => id !== conversationId),
                    conversationId
                ]
            };
        }
        return {};
    }),

    // Get unread count
    getTotalUnread: () => {
        const state = get();
        return state.conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
    }
}));

export { useChatStore };
