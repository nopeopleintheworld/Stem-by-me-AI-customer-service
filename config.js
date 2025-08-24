// Configuration file for 3D代打印服務 AI客服
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
    DEMO_MODE: true, // Disabled demo mode to enable real AI responses

    // Error messages
    ERROR_MESSAGES: {
        NO_CREDITS: '您的OpenRouter帳戶需要充值。請添加積分以繼續使用3D代打印服務AI客服。',
        INVALID_KEY: 'API密鑰無效。請檢查您的OpenRouter API密鑰。',
        RATE_LIMIT: '請求頻率過高。請稍等片刻後再試。',
        NETWORK_ERROR: '網絡錯誤。請檢查您的網絡連接。',
        GENERAL_ERROR: '發生錯誤。請再試一次。'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
