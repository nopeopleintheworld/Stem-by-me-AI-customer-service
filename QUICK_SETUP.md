# Quick Setup Guide

## 🎉 **GREAT NEWS: Using FREE Model!**

Your AI customer service is now using the DeepSeek free model - no credits needed! Here are your options:

### **Option 1: Use FREE Model (Current)**
✅ **Ready to use immediately!**
- Using DeepSeek free model
- No credits required
- Real AI responses

### **Option 2: Test with Demo Mode**
1. Open `config.js`
2. Change `DEMO_MODE: false` to `DEMO_MODE: true`
3. Refresh the page
4. Test without any API calls

### **Option 3: Use Paid Models**
Switch to other models if you want different AI capabilities (requires credits).

## 🎯 **Quick Test Steps**

### **To Test Right Now:**
1. **Enable Demo Mode**:
   ```javascript
   // In config.js, change this line:
   DEMO_MODE: true
   ```
2. **Refresh the page**
3. **Try the chat** - it will work with demo responses!

### **To Use Real AI:**
1. **Add Credits**: Visit [OpenRouter Credits](https://openrouter.ai/settings/credits)
2. **Add $1-5** in credits
3. **Set Demo Mode to false**:
   ```javascript
   DEMO_MODE: false
   ```
4. **Refresh and test**

## 💰 **Cost Information**
- **DeepSeek Free Model**: FREE (no credits needed!)
- **Demo Mode**: FREE (no API calls)
- **Paid Models**: Various costs (GPT-3.5 Turbo ~$0.002 per 1K tokens)

## 🔧 **Configuration Options**

### **Current Settings (FREE Model):**
```javascript
MODEL: 'deepseek/deepseek-chat-v3-0324:free'
MAX_TOKENS: 300
DEMO_MODE: false
```

### **Alternative Models:**
```javascript
// FREE model (current)
MODEL: 'deepseek/deepseek-chat-v3-0324:free'

// Reliable and affordable (requires credits)
MODEL: 'openai/gpt-3.5-turbo'

// Best quality, more expensive (requires credits)
MODEL: 'anthropic/claude-3.5-sonnet'
```

## ✅ **What's Working Now:**
- ✅ Error handling improved
- ✅ Demo mode available
- ✅ Cheaper model configured
- ✅ Better user feedback
- ✅ Favicon fixed

## 🎉 **Next Steps:**
1. **Test with demo mode first** (set `DEMO_MODE: true`)
2. **Add credits when ready** for real AI responses
3. **Enjoy your AI customer service!**

---

**Need help?** Check the `TROUBLESHOOTING.md` file for detailed solutions.
