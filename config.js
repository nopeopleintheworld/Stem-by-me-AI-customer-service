// Configuration file for AI Customer Service
const CONFIG = {
    // OpenRouter API Configuration
    OPENROUTER_API_KEY: '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',
    OPENROUTER_URL: 'https://openrouter.ai/api/v1/chat/completions',

    // AI Model Configuration
    MODEL: 'meta-llama/llama-3.1-8b-instruct', // Fast and reliable free model
    MAX_TOKENS: 150, // Reduced for faster responses
    TEMPERATURE: 0.5, // Lower temperature for more focused responses

    // Alternative models you can use (uncomment to switch):
    // MODEL: 'meta-llama/llama-3.1-8b-instruct', // Current - Fast and reliable FREE model!
    // MODEL: 'deepseek/deepseek-r1:free', // Latest free model (may be rate-limited)
    // MODEL: 'deepseek/deepseek-chat-v3-0324:free', // Previous free model
    // MODEL: 'mistralai/mistral-7b-instruct', // Another fast option
    // MODEL: 'openai/gpt-3.5-turbo', // Reliable and affordable (requires credits)
    // MODEL: 'anthropic/claude-3.5-sonnet', // More expensive but better quality
    // MODEL: 'openai/gpt-4', // Most expensive but highest quality

    // Demo mode (set to true to test without API calls)
    DEMO_MODE: true, // Enable demo mode since free models need credits

    // Error messages
    ERROR_MESSAGES: {
        NO_CREDITS: 'Your OpenRouter account needs credits. Please add credits to continue using the AI service.',
        INVALID_KEY: 'Invalid API key. Please check your OpenRouter API key.',
        RATE_LIMIT: 'Rate limit exceeded. Please wait a moment and try again.',
        NETWORK_ERROR: 'Network error. Please check your internet connection.',
        GENERAL_ERROR: 'An error occurred. Please try again.'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
