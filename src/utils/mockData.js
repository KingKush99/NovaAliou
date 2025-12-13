
// Mock Streamers with Real Names
export const MOCK_STREAMERS = [
    { id: 1, name: 'Alice_Wonder', viewers: 1205, tags: ['Chill', 'Gaming'], image: 'https://i.pravatar.cc/300?img=1' },
    { id: 2, name: 'Jessica_Rose', viewers: 980, tags: ['Dancing', 'Music'], image: 'https://i.pravatar.cc/300?img=5' },
    { id: 3, name: 'Raven_Sky', viewers: 850, tags: ['Chatting', 'Cosplay'], image: 'https://i.pravatar.cc/300?img=9' },
    { id: 4, name: 'Luna_Love', viewers: 720, tags: ['ASMR', 'Vlog'], image: 'https://i.pravatar.cc/300?img=10' },
    { id: 5, name: 'Sarah_Vibes', viewers: 650, tags: ['Gaming', 'Retro'], image: 'https://i.pravatar.cc/300?img=16' },
    { id: 6, name: 'Emma_Stone', viewers: 540, tags: ['Art', 'Design'], image: 'https://i.pravatar.cc/300?img=20' },
    { id: 7, name: 'Mia_Khalifa_Fan', viewers: 1540, tags: ['Modeling', 'Fitness'], image: 'https://i.pravatar.cc/300?img=25' },
    { id: 8, name: 'Sophie_Turner', viewers: 430, tags: ['Cooking', 'IRL'], image: 'https://i.pravatar.cc/300?img=30' },
];

// Generate mock user profiles for match feed
export const generateMockProfiles = (count = 20) => {
    const names = [
        'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia',
        'Harper', 'Evelyn', 'Abigail', 'Emily', 'Ella', 'Scarlett', 'Grace', 'Chloe',
        'Lily', 'Aria', 'Zoe', 'Nora', 'Riley', 'Leah', 'Aubrey', 'Violet',
        'Hannah', 'Stella', 'Hazel', 'Ellie', 'Paisley', 'Audrey', 'Skylar', 'Bella'
    ];

    const interests = [
        'Travel', 'Photography', 'Music', 'Fitness', 'Cooking', 'Art', 'Reading',
        'Dancing', 'Yoga', 'Gaming', 'Movies', 'Fashion', 'Coffee', 'Hiking',
        'Beach', 'Foodie', 'Adventure', 'Pets', 'Sports', 'Netflix'
    ];

    const bios = [
        'Living life one adventure at a time ✨',
        'Coffee addict ☕ | Dog lover 🐕',
        'Making memories around the world 🌍',
        'Fitness enthusiast 💪 | Healthy living',
        'Artist at heart 🎨 | Creative soul',
        'Music is my therapy 🎵',
        'Foodie exploring the city 🍕',
        'Beach bum 🏖️ | Sunset chaser',
        'Bookworm 📚 | Tea lover',
        'Adventure seeker 🏔️ | Thrill lover'
    ];

    return Array.from({ length: count }, (_, i) => {
        const name = names[Math.floor(Math.random() * names.length)];
        const age = Math.floor(Math.random() * 10) + 18; // 18-28
        const distance = Math.floor(Math.random() * 50) + 1; // 1-50 km
        const isPopular = Math.random() > 0.7; // 30% popular users

        const userInterests = [];
        const interestCount = Math.floor(Math.random() * 4) + 2; // 2-5 interests
        for (let j = 0; j < interestCount; j++) {
            const interest = interests[Math.floor(Math.random() * interests.length)];
            if (!userInterests.includes(interest)) {
                userInterests.push(interest);
            }
        }

        const photoId = Math.floor(Math.random() * 99);
        const photos = [
            `https://randomuser.me/api/portraits/women/${photoId}.jpg`,
            `https://randomuser.me/api/portraits/women/${(photoId + 1) % 99}.jpg`,
            `https://randomuser.me/api/portraits/women/${(photoId + 2) % 99}.jpg`
        ];

        return {
            id: `user-${i + 1}`,
            name,
            age,
            bio: bios[Math.floor(Math.random() * bios.length)],
            photos: photos,
            interests: userInterests,
            distance,
            isPopular,
            verified: Math.random() > 0.5,
            isOnline: Math.random() > 0.6
        };
    });
};

// Generate mock conversations
export const generateMockConversations = (profiles) => {
    const messages = [
        "Hey! How's it going?",
        "Love your profile! 😊",
        "What are you up to today?",
        "That's so cool!",
        "We should hang out sometime",
        "Haha that's funny 😄",
        "What kind of music do you like?",
        "I love that place too!",
        "Nice to meet you!",
        "Tell me more about yourself"
    ];

    return profiles.slice(0, 10).map((profile, i) => ({
        id: `conv-${i + 1}`,
        userId: profile.id,
        userName: profile.name,
        userPhoto: profile.photos[0],
        lastMessage: messages[Math.floor(Math.random() * messages.length)],
        lastMessageTime: new Date(Date.now() - Math.random() * 86400000 * 7), // Last 7 days
        unreadCount: Math.floor(Math.random() * 5),
        isOnline: profile.isOnline
    }));
};

// Generate mock messages for a conversation
export const generateMockMessages = (conversationId, count = 20) => {
    const messageTexts = [
        "Hey! How are you?",
        "I'm doing great, thanks!",
        "What are you up to today?",
        "Just relaxing at home",
        "Want to grab coffee sometime?",
        "That sounds amazing!",
        "I'd love to!",
        "How about this weekend?",
        "Perfect! 😊",
        "Looking forward to it!",
        "Me too!",
        "What kind of coffee do you like?",
        "I'm a latte person ☕",
        "Nice! I love cappuccinos",
        "Great taste! 😄",
        "Thanks! You too",
        "So what do you do for fun?",
        "I love hiking and photography",
        "That's so cool!",
        "We have a lot in common!"
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: `msg-${conversationId}-${i + 1}`,
        text: messageTexts[i % messageTexts.length],
        senderId: i % 3 === 0 ? 'me' : 'other',
        timestamp: new Date(Date.now() - (count - i) * 300000), // 5 min intervals
        read: i < count - 3
    }));
};

// Generate mock games
export const generateMockGames = () => [
    {
        id: 'game-1',
        name: 'Lucky Spin',
        description: 'Spin the wheel for diamonds!',
        reward: 50,
        thumbnail: '🎰',
        plays: 1234
    },
    {
        id: 'game-2',
        name: 'Memory Match',
        description: 'Match the cards',
        reward: 30,
        thumbnail: '🃏',
        plays: 892
    },
    {
        id: 'game-3',
        name: 'Quiz Master',
        description: 'Test your knowledge',
        reward: 40,
        thumbnail: '🧠',
        plays: 1567
    },
    {
        id: 'game-4',
        name: 'Scratch Card',
        description: 'Scratch to win!',
        reward: 25,
        thumbnail: '🎫',
        plays: 2341
    },
    {
        id: 'game-5',
        name: 'Treasure Hunt',
        description: 'Find hidden diamonds',
        reward: 60,
        thumbnail: '💎',
        plays: 987
    },
    {
        id: 'game-6',
        name: 'Daily Puzzle',
        description: 'Solve the puzzle',
        reward: 35,
        thumbnail: '🧩',
        plays: 1456
    }
];

// Generate mock leaderboard
export const generateMockLeaderboard = (count = 50) => {
    const names = [
        'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia',
        'Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas',
        'Harper', 'Evelyn', 'Abigail', 'Emily', 'Ella', 'Scarlett', 'Grace', 'Chloe',
        'Mason', 'Ethan', 'Alexander', 'Henry', 'Jacob', 'Michael', 'Daniel', 'Logan'
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: `lb-user-${i + 1}`,
        name: names[i % names.length] + (i > names.length ? ` ${i}` : ''),
        avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
        coins: Math.floor(100000 * Math.pow(0.9, i)), // Exponential decay for realistic curve
        matches: Math.floor(Math.random() * 500) + 20,
        rank: i + 1
    }));
};

export default {
    MOCK_STREAMERS,
    generateMockProfiles,
    generateMockConversations,
    generateMockMessages,
    generateMockGames,
    generateMockLeaderboard
};
