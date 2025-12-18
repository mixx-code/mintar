export const Colors = {
    blue: {
        satu: '#B6FFFA',
        dua: '#98E4FF',
        tiga: '#80B3FF',
        empat: '#687EFF'
    },
    pink: '#FF5D9E',
    purple: '#9900F0',
    green: {
        muda: '#82CD47',
        agakTua: '#54B435',
        tua: '#379237'
    },
    
    // ===== NEW ADDITIONS FOR DARK THEME =====
    
    // Background Colors (for cards, containers)
    background: {
        primary: '#1E1E1E',      // Main dark background
        secondary: '#252525',    // Slightly lighter for contrast
        tertiary: '#2A2A2A',     // For nested components
        card: '#1E1E1E',         // Card background
        accent: '#2A3B5A',       // Accented cards
        highlight: '#2D3748',    // Highlighted cards
    },
    
    // Text Colors
    text: {
        primary: '#FFFFFF',      // Main text (titles, important)
        secondary: '#CCCCCC',    // Body text, descriptions
        tertiary: '#999999',     // Subtle text (dates, captions)
        disabled: '#666666',     // Disabled text
        accent: '#64B5F6',       // Accent/important text
        success: '#81C784',      // Success messages
        warning: '#FFD54F',      // Warnings
        error: '#F44336',        // Errors
    },
    
    // Border Colors
    border: {
        light: '#333333',        // Light borders
        medium: '#2D2D2D',       // Medium borders
        dark: '#1F1F1F',         // Dark borders
        accent: '#687EFF',       // Using your existing blue.empat
    },
    
    // Status Colors
    status: {
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
    },
    
    // Gradient Colors (using your existing palette)
    gradient: {
        blueToPurple: ['#80B3FF', '#687EFF'],    // blue.tiga to blue.empat
        green: ['#82CD47', '#379237'],           // green.muda to green.tua
        pinkToPurple: ['#FF5D9E', '#9900F0'],    // pink to purple
    },
    
    // UI Element Colors
    ui: {
        button: {
            primary: '#687EFF',      // Using blue.empat
            secondary: '#2A2A2A',
            success: '#54B435',      // Using green.agakTua
        },
        icon: '#CCCCCC',
        divider: '#333333',
        overlay: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Shadow Colors
    shadow: {
        soft: 'rgba(0, 0, 0, 0.15)',
        medium: 'rgba(0, 0, 0, 0.25)',
        strong: 'rgba(0, 0, 0, 0.4)',
    }
};