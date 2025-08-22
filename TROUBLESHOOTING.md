# Troubleshooting Guide

## Common Issues and Solutions

### 1. Error 402 - Payment Required

**Problem**: You're getting a 402 error when trying to use the AI chat.

**Solution**: 
1. **Add Credits to OpenRouter**: 
   - Go to [OpenRouter Dashboard](https://openrouter.ai/keys)
   - Add credits to your account
   - Credits are very affordable (usually $1-5 for testing)

2. **Check API Key**:
   - Verify your API key is correct in `config.js`
   - Make sure there are no extra spaces or characters

3. **Use a Different Model**:
   - Edit `config.js` and change the model to a cheaper option:
   ```javascript
   MODEL: 'openai/gpt-3.5-turbo', // Cheapest option
   // MODEL: 'google/gemini-pro', // Good alternative
   // MODEL: 'anthropic/claude-3.5-sonnet', // More expensive
   ```

### 2. Error 401 - Unauthorized

**Problem**: Invalid API key error.

**Solution**:
1. **Get a New API Key**:
   - Go to [OpenRouter](https://openrouter.ai/)
   - Sign up/Login
   - Create a new API key
   - Replace the key in `config.js`

2. **Check Key Format**:
   - API keys should start with `sk-or-v1-`
   - Make sure the key is complete (no truncation)

### 3. Error 429 - Rate Limit

**Problem**: Too many requests.

**Solution**:
1. **Wait a few minutes** and try again
2. **Reduce usage** - the free tier has limits
3. **Upgrade your plan** on OpenRouter

### 4. Network Errors

**Problem**: Can't connect to the API.

**Solution**:
1. **Check internet connection**
2. **Try refreshing the page**
3. **Check if OpenRouter is down** at [status.openrouter.ai](https://status.openrouter.ai)

## Quick Fix Steps

### Step 1: Add Credits (Most Common Fix)
1. Visit [OpenRouter Dashboard](https://openrouter.ai/keys)
2. Click "Add Credits"
3. Add $1-5 worth of credits
4. Try the chat again

### Step 2: Verify API Key
1. Open `config.js`
2. Check that your API key is correct
3. Make sure it starts with `sk-or-v1-`

### Step 3: Use Cheaper Model
1. Open `config.js`
2. Change the model to:
   ```javascript
   MODEL: 'openai/gpt-3.5-turbo'
   ```

### Step 4: Test with Minimal Usage
1. Send short messages
2. Wait between messages
3. Don't send too many messages at once

## Cost Information

- **GPT-3.5 Turbo**: ~$0.002 per 1K tokens (very cheap)
- **Claude 3.5 Sonnet**: ~$0.015 per 1K tokens (moderate)
- **GPT-4**: ~$0.03 per 1K tokens (expensive)

**Example**: 100 messages with GPT-3.5 Turbo ≈ $0.10-0.50

## Getting Help

1. **Check the browser console** for detailed error messages
2. **Visit OpenRouter Support** at [docs.openrouter.ai](https://docs.openrouter.ai)
3. **Check your account status** at [openrouter.ai/keys](https://openrouter.ai/keys)

## Alternative Solutions

If OpenRouter continues to have issues, you can:

1. **Use a different provider** (OpenAI, Anthropic, Google)
2. **Set up your own API key** with the original providers
3. **Use a local AI model** (requires more setup)

---

**Most Common Solution**: Add $1-5 in credits to your OpenRouter account! 🎯
