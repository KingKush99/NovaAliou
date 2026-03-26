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
        const id = String(conversationId);
        const name = data?.name || data?.userName || `User ${id}`;
        const avatar = data?.avatar || data?.userPhoto;

        const existsIndex = state.conversations.findIndex(c => String(c.id) === id);
        if (existsIndex === -1) {
            return {
                conversations: [
                    ...state.conversations,
                    {
                        id,
                        userId: id,
                        name,
                        avatar,
                        isOnline: Boolean(data?.isOnline),
                        unreadCount: 0,
                        lastMessage: '',
                        lastMessageTime: new Date()
                    }
                ],
                activeConversation: id
            };
        }

        // Keep existing conversation but refresh identity fields if provided.
        const nextConversations = state.conversations.slice();
        nextConversations[existsIndex] = {
            ...nextConversations[existsIndex],
            name: name || nextConversations[existsIndex].name,
            avatar: avatar || nextConversations[existsIndex].avatar,
            isOnline: data?.isOnline ?? nextConversations[existsIndex].isOnline
        };

        return { conversations: nextConversations, activeConversation: id };
    }),

    // Set active conversation
    setActiveConversation: (conversationId) => set({
        activeConversation: String(conversationId)
    }),

    // Add message
    addMessage: (conversationId, message) => set((state) => {
        const id = String(conversationId);
        const conversationMessages = state.messages[id] || [];

        return {
            messages: {
                ...state.messages,
                [id]: [...conversationMessages, {
                    ...message,
                    id: Date.now(),
                    timestamp: new Date()
                }]
            },
            conversations: state.conversations.map(conv =>
                String(conv.id) === id
                    ? {
                        ...conv,
                        lastMessage: message.text,
                        lastMessageTime: new Date(),
                        unreadCount: String(conv.id) === String(state.activeConversation) ? 0 : (conv.unreadCount || 0) + 1
                    }
                    : conv
            )
        };
    }),

    // Load messages for conversation
    loadMessages: (conversationId, messages) => set((state) => ({
        // Normalize key to string to avoid collisions/duplicates.
        messages: {
            ...state.messages,
            [String(conversationId)]: messages
        }
    })),

    // Mark as read
    markAsRead: (conversationId) => set((state) => ({
        conversations: state.conversations.map(conv =>
            String(conv.id) === String(conversationId)
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
    },

    // Clear everything (Production sanity)
    clearAllChats: () => set({
        conversations: [],
        messages: {},
        activeConversation: null,
        openWindows: []
    })
}));

export { useChatStore };
