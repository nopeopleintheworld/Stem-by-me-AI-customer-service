// OpenRouter API Configuration
const OPENROUTER_API_KEY = CONFIG.OPENROUTER_API_KEY;
const OPENROUTER_URL = CONFIG.OPENROUTER_URL;

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');
const quickActionButtons = document.querySelectorAll('.quick-action-btn');
const scrollToTopBtn = document.getElementById('scrollToTop');
const scrollToBottomBtn = document.getElementById('scrollToBottom');

// Chat state
let conversationHistory = [
    {
        role: "system",
        content: `You are a helpful AI customer service assistant. Your role is to:
- Provide excellent customer service with a friendly, professional tone
- Help customers with product information, order status, returns, technical issues, and general inquiries
- Be concise but thorough in your responses
- Ask clarifying questions when needed
- Provide accurate information about business hours, policies, and procedures
- Escalate complex issues appropriately
- Always be polite and patient
- Respond in Chinese (中文) when the customer asks in Chinese
- Be bilingual and helpful in both English and Chinese

Keep responses conversational and helpful. If you don't have specific information about a company's policies, provide general guidance and suggest contacting human support for specific details.`
    }
];

// Initialize the chat
document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
    autoResizeTextarea();

    // Initialize scroll buttons state
    handleScroll();
});

// Setup event listeners
function setupEventListeners() {
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key (Shift+Enter for new line)
    messageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', autoResizeTextarea);

    // Quick action buttons
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function () {
            const message = this.getAttribute('data-message');
            messageInput.value = message;
            sendMessage();
        });
    });

    // Scroll control buttons
    scrollToTopBtn.addEventListener('click', scrollToTop);
    scrollToBottomBtn.addEventListener('click', scrollToBottom);

    // Chat messages scroll event
    chatMessages.addEventListener('scroll', handleScroll);
}

// Auto-resize textarea
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// Send message function
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Disable input and button
    messageInput.disabled = true;
    sendButton.disabled = true;

    // Add user message to chat
    addMessageToChat('user', message);

    // Clear input
    messageInput.value = '';
    autoResizeTextarea();

    // Show typing indicator
    showTypingIndicator();

    try {
        // Add user message to conversation history
        conversationHistory.push({
            role: "user",
            content: message
        });

        // Get AI response
        const response = await getAIResponse(conversationHistory);

        // Add AI response to conversation history
        conversationHistory.push({
            role: "assistant",
            content: response
        });

        // Hide typing indicator and add AI response immediately
        hideTypingIndicator();
        addMessageToChat('bot', response);

    } catch (error) {
        console.error('Error getting AI response:', error);
        hideTypingIndicator();
        addMessageToChat('bot', 'I apologize, but I\'m experiencing technical difficulties right now. Please try again in a moment or contact our human support team for immediate assistance. Please contact our human support team for immediate assistance.');
    } finally {
        // Re-enable input and button
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    }
}

// Get AI response from OpenRouter API
async function getAIResponse(messages) {
    // Demo mode - return predefined responses for testing
    if (CONFIG.DEMO_MODE) {
        return getDemoResponse(messages[messages.length - 1].content);
    }

    const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI Customer Service'
        },
        body: JSON.stringify({
            model: CONFIG.MODEL,
            messages: messages,
            max_tokens: CONFIG.MAX_TOKENS,
            temperature: CONFIG.TEMPERATURE,
            stream: false
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Details:', errorText);

        if (response.status === 402) {
            throw new Error(CONFIG.ERROR_MESSAGES.NO_CREDITS);
        } else if (response.status === 401) {
            throw new Error(CONFIG.ERROR_MESSAGES.INVALID_KEY);
        } else if (response.status === 429) {
            throw new Error(CONFIG.ERROR_MESSAGES.RATE_LIMIT);
        } else if (response.status === 400) {
            // Check if it's a model error
            if (errorText.includes('not a valid model ID')) {
                throw new Error('Invalid model configuration. Please check the model ID in config.js');
            } else {
                throw new Error('Bad request. Please check your configuration.');
            }
        } else {
            throw new Error(CONFIG.ERROR_MESSAGES.GENERAL_ERROR);
        }
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Demo responses for testing without API
function getDemoResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Check if message contains Chinese characters
    const hasChinese = /[\u4e00-\u9fff]/.test(userMessage);

    if (hasChinese) {
        // Chinese responses
        if (message.includes('订单') || message.includes('帮助') || message.includes('order') || message.includes('help')) {
            return "我很乐意帮助您处理订单问题！请提供您的订单号，我可以为您查询状态并提供详细信息。";
        } else if (message.includes('退货') || message.includes('退款') || message.includes('return') || message.includes('refund')) {
            return "关于退货和退款，您可以通过账户仪表板发起流程或联系我们的退货部门。大多数商品可以在购买后30天内退货。您有订单号吗？";
        } else if (message.includes('技术') || message.includes('问题') || message.includes('technical') || message.includes('issue')) {
            return "很抱歉听到您遇到技术问题。让我帮您解决。请描述您遇到的具体问题，这样我就能提供最相关的解决方案。";
        } else if (message.includes('营业时间') || message.includes('时间') || message.includes('business hours') || message.includes('hours')) {
            return "我们的客服时间是周一至周五上午9点至下午6点（东部时间），周六上午10点至下午4点。周日和主要节假日休息。有什么我可以帮助您的吗？";
        } else if (message.includes('你好') || message.includes('hi') || message.includes('hello')) {
            return "您好！欢迎使用我们的客服。我可以帮助您处理订单、退货、技术支持或一般咨询问题。今天有什么我可以帮助您的吗？";
        } else {
            return "感谢您的留言！我在这里帮助处理客服咨询。请提供更多关于您需要帮助的详细信息。我可以帮助处理订单、退货、技术问题和一般问题。";
        }
    } else {
        // English responses
        if (message.includes('order') || message.includes('help')) {
            return "I'd be happy to help with your order! Could you please provide your order number? I can then check the status and provide you with detailed information about your purchase.";
        } else if (message.includes('return') || message.includes('refund')) {
            return "For returns and refunds, you can initiate the process through your account dashboard or contact our returns department. Most items can be returned within 30 days of purchase. Do you have your order number handy?";
        } else if (message.includes('technical') || message.includes('issue')) {
            return "I'm sorry to hear you're experiencing technical issues. Let me help you troubleshoot. Could you describe the specific problem you're encountering? This will help me provide the most relevant solution.";
        } else if (message.includes('business hours') || message.includes('hours')) {
            return "Our customer service hours are Monday through Friday, 9 AM to 6 PM EST, and Saturday 10 AM to 4 PM EST. We're closed on Sundays and major holidays. Is there anything specific I can help you with?";
        } else if (message.includes('hello') || message.includes('hi')) {
            return "Hello! Welcome to our customer service. I'm here to help you with any questions about orders, returns, technical support, or general inquiries. How can I assist you today?";
        } else {
            return "Thank you for your message! I'm here to help with customer service inquiries. Could you please provide more details about what you need assistance with? I can help with orders, returns, technical issues, and general questions.";
        }
    }
}



// Format message (convert URLs to links, handle line breaks)
function formatMessage(message) {
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    message = message.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    // Convert line breaks to <br> tags
    message = message.replace(/\n/g, '<br>');

    return message;
}

// Get current time
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Show typing indicator
function showTypingIndicator() {
    typingIndicator.classList.add('show');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    typingIndicator.classList.remove('show');
}

// Error handling for network issues
window.addEventListener('online', function () {
    console.log('Connection restored');
});

window.addEventListener('offline', function () {
    addMessageToChat('bot', 'I notice you\'re offline. Please check your internet connection and try again.');
});

// Add some helpful utility functions
function addSystemMessage(message) {
    addMessageToChat('bot', message);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        messageInput.focus();
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + K to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        messageInput.focus();
    }

    // Escape to clear input
    if (e.key === 'Escape') {
        messageInput.value = '';
        autoResizeTextarea();
        messageInput.focus();
    }

    // Home key to scroll to top
    if (e.key === 'Home') {
        e.preventDefault();
        scrollToTop();
    }

    // End key to scroll to bottom
    if (e.key === 'End') {
        e.preventDefault();
        scrollToBottom();
    }
});

// Add message character counter
messageInput.addEventListener('input', function () {
    const maxLength = 1000;
    const currentLength = this.value.length;
    const remaining = maxLength - currentLength;

    // You could add a character counter here if desired
    if (currentLength > maxLength * 0.9) {
        this.style.borderColor = '#ef4444';
    } else {
        this.style.borderColor = '#e2e8f0';
    }
});

// Scroll functions
function scrollToTop() {
    chatMessages.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToBottom() {
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

// Handle scroll events to show/hide scroll buttons
function handleScroll() {
    const scrollTop = chatMessages.scrollTop;
    const scrollHeight = chatMessages.scrollHeight;
    const clientHeight = chatMessages.clientHeight;

    // Show/hide scroll to top button
    if (scrollTop > 100) {
        scrollToTopBtn.classList.remove('hidden');
    } else {
        scrollToTopBtn.classList.add('hidden');
    }

    // Show/hide scroll to bottom button
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (!isAtBottom) {
        scrollToBottomBtn.classList.remove('hidden');
    } else {
        scrollToBottomBtn.classList.add('hidden');
    }
}

// Update addMessageToChat to use faster scrolling
function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';

    if (sender === 'user') {
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    } else {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    }

    const content = document.createElement('div');
    content.className = 'message-content';

    const text = document.createElement('div');
    text.className = 'message-text';
    text.innerHTML = formatMessage(message);

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = getCurrentTime();

    content.appendChild(text);
    content.appendChild(time);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatMessages.appendChild(messageDiv);

    // Use faster scrolling
    setTimeout(scrollToBottom, 50);
}
