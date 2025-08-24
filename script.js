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
const humanSupportBtn = document.getElementById('humanSupportBtn');

// Chat state
let conversationHistory = [
    {
        role: "system",
        content: `您是一個專業的3D代打印服務AI客服助手。您的角色是：
- 提供優質的3D打印服務諮詢，態度友好專業
- 協助客戶了解下單流程、報價計算和訂單狀態
- 提供3D模型優化建議和材料選擇指導
- 解答打印參數設置和技術問題
- 處理售後服務和投訴問題
- 提供準確的價格信息和交貨時間
- 回應簡潔但詳細
- 需要時提出澄清問題以提供更好協助
- 提供準確的3D打印服務信息
- 適當升級複雜問題
- 始終保持禮貌和耐心
- 主要使用中文回應，但也能處理英文查詢
- 雙語支持，中英文都提供協助

保持對話友好實用。專注於3D打印服務的實用解決方案和最佳實踐。`
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

    // Human support button
    humanSupportBtn.addEventListener('click', handleHumanSupport);
}

// Handle human support button click
function handleHumanSupport() {
    const supportMessage = `您好！我理解您需要人工客服協助。以下是我們的聯繫方式：

📞 **電話支援**: +886 2 1234 5678
⏰ **服務時間**: 週一至週五 9:00-18:00

📧 **電子郵件**: support@3dprint-service.com
⏱️ **回覆時間**: 24小時內

💬 **Line客服**: @3dprint-service
⚡ **即時支援**: 線上即時回覆

請選擇最適合您的聯繫方式，我們的人工客服團隊將很樂意為您提供專業協助！`;

    addMessageToChat('bot', supportMessage);

    // Add a system message to indicate human support was requested
    addSystemMessage('客戶已點擊人工支援按鈕，建議提供詳細聯繫信息。');
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
        // Chinese responses for 3D printing service
        if (message.includes('下單') || message.includes('order') || message.includes('購買') || message.includes('buy')) {
            return "歡迎下單我們的3D打印服務！請按以下步驟操作：1）前往我們位於Carousell的商店 2）上傳您的STL文件 2）選擇材料和顏色 3）確認尺寸和數量 ";
        } else if (message.includes('訂單') || message.includes('order') || message.includes('狀態') || message.includes('status')) {
            return "我可以幫您查詢訂單狀態。請提供您的訂單號碼，我會為您查看最新的處理進度。通常3D打印訂單需要3-5個工作日完成，複雜模型可能需要更長時間。";
        } else if (message.includes('價格') || message.includes('price') || message.includes('費用') || message.includes('cost')) {
            return "我們的價格計算基於：1）模型重量（克）2）材料成本 3）打印時間 4）後處理需求。一般PLA材料約$0.6/ 1克。您想了解具體報價嗎？";
        } else if (message.includes('材料') || message.includes('material') || message.includes('filament')) {
            return "我們提供多種材料選擇：PLA（環保易打印）、PETG（強度好）、ABS（耐高溫）、TPU（柔性）、PC（高強度）、金屬填充等。您打算打印什麼用途的物品？我可以推薦最適合的材料。";
        } else if (message.includes('模型') || message.includes('model') || message.includes('優化') || message.includes('optimize')) {
            return "我可以幫您檢查和優化3D模型！常見問題包括：1）模型封閉性 2）壁厚是否足夠 3）支撐結構需求 4）打印方向優化。請上傳您的STL文件，我會提供詳細的優化建議。";
        } else if (message.includes('時間') || message.includes('time') || message.includes('多久') || message.includes('delivery')) {
            return "標準交貨時間：小件物品（<100g）1-2個工作日，中等物品（100-500g）3-5個工作日，大件物品（>500g）5-7個工作日。";
        } else if (message.includes('你好') || message.includes('hi') || message.includes('hello')) {
            return "您好！歡迎使用我們的3D代打印服務AI客服。我可以協助您下單、查詢訂單、選擇材料、優化模型等。今天有什麼我可以幫助您的嗎？";
        } else {
            return "抱歉，我現在遇到了技術問題。請稍後重試，或聯絡我們的人工支援團隊尋求協助。請聯絡我們的人工支援團隊尋求協助。";
        }
    } else {
        // English responses for 3D printing service
        if (message.includes('order') || message.includes('purchase') || message.includes('buy')) {
            return "Welcome to our 3D printing service! To place an order: 1) Upload your STL file 2) Select material and color 3) Confirm dimensions and quantity 4) Fill in shipping details. Do you have your STL file ready? I can guide you through the entire ordering process.";
        } else if (message.includes('status') || message.includes('tracking')) {
            return "I can help you check your order status! Please provide your order number and I'll look up the latest processing progress. 3D printing orders typically take 3-5 business days, complex models may take longer.";
        } else if (message.includes('price') || message.includes('cost') || message.includes('quote')) {
            return "Our pricing is based on: 1) Model volume (cubic cm) 2) Material cost 3) Print time 4) Post-processing needs. PLA typically costs $0.5-1/cubic cm, PETG $0.8-1.5/cubic cm. Would you like a specific quote?";
        } else if (message.includes('material') || message.includes('filament')) {
            return "We offer various materials: PLA (eco-friendly), PETG (strong), ABS (heat-resistant), TPU (flexible), PC (high-strength), metal-filled, etc. What will you be printing? I can recommend the best material.";
        } else if (message.includes('model') || message.includes('optimize') || message.includes('stl')) {
            return "I can help check and optimize your 3D model! Common issues include: 1) Model watertightness 2) Wall thickness 3) Support structure needs 4) Print orientation. Please upload your STL file for detailed optimization advice.";
        } else if (message.includes('time') || message.includes('delivery') || message.includes('duration')) {
            return "Standard delivery times: Small items (<100g) 1-2 business days, Medium items (100-500g) 3-5 business days, Large items (>500g) 5-7 business days. Express service available for 24-hour completion.";
        } else if (message.includes('hello') || message.includes('hi')) {
            return "Hello! Welcome to our 3D printing service AI support. I can help with ordering, order tracking, material selection, model optimization, and more. How can I assist you today?";
        } else {
            return "Thank you for your inquiry! I'm your 3D printing service AI assistant. I can help with ordering, order status, material selection, model optimization, pricing, and more. What do you need help with?";
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
