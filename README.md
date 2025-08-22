# AI Customer Service Website

A modern, responsive AI customer service chat interface built with HTML, CSS, and JavaScript, powered by the OpenRouter API.

## Features

- 🤖 **AI-Powered Chat**: Uses Claude 3.5 Sonnet via OpenRouter API for intelligent responses
- 💬 **Real-time Chat Interface**: Modern chat UI with typing indicators and smooth animations
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Quick Actions**: Pre-defined buttons for common customer service queries
- ⌨️ **Keyboard Shortcuts**: 
  - `Enter` to send message
  - `Shift + Enter` for new line
  - `Ctrl/Cmd + K` to focus input
  - `Escape` to clear input
- 🔗 **Smart Formatting**: Automatically converts URLs to clickable links
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Files Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Setup Instructions

1. **Download/Clone** all files to your local machine
2. **Open** `index.html` in your web browser
3. **Start chatting** with the AI customer service assistant!

## API Configuration

The website is already configured with your OpenRouter API key. The API key is embedded in the `script.js` file:

```javascript
const OPENROUTER_API_KEY = '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';
```

## How to Use

### Basic Chat
1. Type your message in the input field at the bottom
2. Press `Enter` or click the send button (paper plane icon)
3. The AI will respond with helpful customer service information

### Quick Actions
Use the quick action buttons at the bottom for common queries:
- **Order Help**: Get assistance with orders
- **Returns**: Information about returns and refunds
- **Technical Support**: Help with technical issues
- **Business Hours**: Check operating hours

### Features
- **Auto-resize textarea**: The input field grows as you type
- **Typing indicator**: Shows when the AI is responding
- **Message timestamps**: Each message shows when it was sent
- **Smooth scrolling**: Chat automatically scrolls to new messages
- **Error handling**: Graceful handling of network issues

## Customization

### Changing the AI Model
In `script.js`, you can change the AI model by modifying this line:
```javascript
model: 'anthropic/claude-3.5-sonnet'
```

Available models include:
- `anthropic/claude-3.5-sonnet` (current)
- `openai/gpt-4`
- `openai/gpt-3.5-turbo`
- `google/gemini-pro`

### Styling
Modify `styles.css` to customize:
- Colors and gradients
- Fonts and typography
- Layout and spacing
- Animations and transitions

### AI Behavior
Edit the system prompt in `script.js` to change how the AI responds:
```javascript
content: `You are a helpful AI customer service assistant. Your role is to:...`
```

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Security Notes

- The API key is visible in the client-side code (this is normal for frontend-only applications)
- For production use, consider implementing a backend server to protect your API key
- The website uses HTTPS-compatible API calls

## Troubleshooting

### Common Issues

1. **AI not responding**: Check your internet connection and API key validity
2. **Messages not sending**: Ensure the input field is not disabled
3. **Styling issues**: Clear browser cache and refresh the page
4. **API errors**: Check the browser console for detailed error messages

### Network Issues
The website includes offline detection and will notify you if you lose internet connectivity.

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your internet connection
3. Ensure all files are in the same directory
4. Try refreshing the page

## License

This project is open source and available for personal and commercial use.

---

**Enjoy your AI customer service experience!** 🤖✨
