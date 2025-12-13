// Quick script to check which pages need back buttons
// Pages that should have back buttons: ALL except Home and StartScreen

const pagesNeedingBackButtons = [
    'Chat.jsx',
    'ChatSplitView.jsx', // Has it
    'Chats.jsx',
    'GameCenter.jsx',
    'Games.jsx',
    'History.jsx',
    'Leaderboard.jsx',
    'Legal.jsx', // Has it
    'Matches.jsx',
    'Messages.jsx',
    'ModelDashboard.jsx', // Has it
    'ModelSignup.jsx',
    'Onboarding.jsx',
    'Profile.jsx', // Has it (for other users)
    'Settings.jsx', // Has it
    'Store.jsx',
    'StreamRoom.jsx',
    'Streams.jsx',
    'Themes.jsx',
    'UserProfile.jsx',
    'VideoCall.jsx',
    'games/NameThatMeme.jsx', // Has it
    'games/NameThePornstar.jsx' // Has it
];

// Pages that should NOT have back buttons:
// - Home.jsx (main page)
// - StartScreen.jsx (entry point)

console.log('Pages needing back buttons:', pagesNeedingBackButtons.length);
