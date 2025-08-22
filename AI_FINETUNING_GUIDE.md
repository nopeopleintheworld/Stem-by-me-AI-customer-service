# AI Fine-tuning 平台指南

## 🎯 **最佳微调平台推荐**

### **1. OpenRouter (推荐)**
- **网址**: https://openrouter.ai/
- **优势**: 
  - 支持多种模型微调
  - 有免费额度
  - 界面友好
  - 支持自定义数据集
- **适合**: 初学者到专业用户

### **2. OpenAI Fine-tuning**
- **网址**: https://platform.openai.com/docs/guides/fine-tuning
- **优势**:
  - 官方支持
  - 文档完善
  - 质量高
- **缺点**: 需要付费
- **适合**: 企业级应用

### **3. Hugging Face**
- **网址**: https://huggingface.co/
- **优势**:
  - 开源模型多
  - 社区活跃
  - 免费选项
- **适合**: 技术用户

### **4. Google Vertex AI**
- **网址**: https://cloud.google.com/vertex-ai
- **优势**:
  - 企业级服务
  - 集成Google生态
- **适合**: 大型企业

## 🚀 **快速开始 - OpenRouter 微调**

### **步骤 1: 准备数据**
```json
[
  {
    "messages": [
      {"role": "user", "content": "客户问：我的订单什么时候到？"},
      {"role": "assistant", "content": "您好！请提供您的订单号，我可以为您查询配送状态。通常订单会在3-5个工作日内送达。"}
    ]
  },
  {
    "messages": [
      {"role": "user", "content": "我想退货"},
      {"role": "assistant", "content": "好的，我来帮您处理退货。请提供订单号，我们的退货政策是30天内可无理由退货。"}
    ]
  }
]
```

### **步骤 2: 上传到 OpenRouter**
1. 登录 https://openrouter.ai/
2. 进入 "Fine-tuning" 部分
3. 上传您的JSONL格式数据
4. 选择基础模型
5. 开始训练

### **步骤 3: 使用微调模型**
```javascript
// 在 config.js 中使用您的微调模型
MODEL: 'your-org/your-finetuned-model'
```

## 💰 **成本对比**

| 平台 | 免费额度 | 付费价格 | 适合人群 |
|------|----------|----------|----------|
| OpenRouter | 有 | $0.01-0.10/1K tokens | 个人/小企业 |
| OpenAI | 无 | $0.03-0.12/1K tokens | 企业 |
| Hugging Face | 有 | 按使用量 | 开发者 |
| Google Vertex | 有 | 按使用量 | 大企业 |

## 🛠️ **技术实现**

### **自定义客服AI实现**
```javascript
// 在您的项目中添加微调模型支持
const CUSTOM_MODEL = {
    // 您的微调模型ID
    MODEL_ID: 'your-org/customer-service-ai',
    
    // 自定义系统提示
    SYSTEM_PROMPT: `您是一个专业的客服AI助手，专门处理：
    - 订单查询和状态
    - 退货和退款
    - 技术支持
    - 产品咨询
    
    请用友好、专业的语气回答客户问题。`,
    
    // 微调参数
    PARAMETERS: {
        temperature: 0.7,
        max_tokens: 200,
        top_p: 0.9
    }
};
```

## 📊 **数据集准备指南**

### **客服对话数据示例**
```jsonl
{"messages": [{"role": "user", "content": "我的包裹丢失了"}, {"role": "assistant", "content": "非常抱歉听到这个消息。请提供您的订单号和追踪号，我会立即为您查询包裹状态并协助处理。"}]}
{"messages": [{"role": "user", "content": "产品有质量问题"}, {"role": "assistant", "content": "对于质量问题，我们深表歉意。请提供订单号和产品照片，我们会安排退换货服务。"}]}
{"messages": [{"role": "user", "content": "如何修改收货地址"}, {"role": "assistant", "content": "您可以在订单确认前修改收货地址。如果订单已确认，请尽快联系客服，我们会协助您处理。"}]}
```

### **数据格式要求**
- **格式**: JSONL (每行一个JSON对象)
- **编码**: UTF-8
- **大小**: 建议100-1000个对话样本
- **质量**: 多样化、真实的客服对话

## 🎯 **微调最佳实践**

### **1. 数据质量**
- ✅ 使用真实的客服对话
- ✅ 包含各种问题类型
- ✅ 保持对话的自然性
- ✅ 确保回答的准确性

### **2. 模型选择**
- **小数据集** (< 100样本): 使用较小的模型
- **大数据集** (> 500样本): 可以使用较大的模型
- **专业领域**: 选择适合的基础模型

### **3. 训练参数**
```javascript
const TRAINING_CONFIG = {
    epochs: 3,           // 训练轮数
    learning_rate: 1e-5, // 学习率
    batch_size: 4,       // 批次大小
    validation_split: 0.1 // 验证集比例
};
```

## 🔧 **集成到您的项目**

### **更新配置文件**
```javascript
// config.js
const CONFIG = {
    // 现有配置...
    
    // 微调模型配置
    FINETUNED_MODEL: {
        enabled: true,
        model_id: 'your-org/customer-service-ai',
        fallback_model: 'openai/gpt-3.5-turbo', // 备用模型
        confidence_threshold: 0.8 // 置信度阈值
    }
};
```

### **智能模型选择**
```javascript
// 在 script.js 中添加智能模型选择
async function getAIResponse(messages) {
    if (CONFIG.FINETUNED_MODEL.enabled) {
        try {
            // 尝试使用微调模型
            return await callFinetunedModel(messages);
        } catch (error) {
            console.log('微调模型失败，使用备用模型');
            // 回退到备用模型
            return await callFallbackModel(messages);
        }
    } else {
        // 使用默认模型
        return await callDefaultModel(messages);
    }
}
```

## 📈 **性能监控**

### **关键指标**
- **响应时间**: 目标 < 2秒
- **准确率**: 目标 > 90%
- **客户满意度**: 目标 > 4.5/5
- **成本效率**: 每1000次对话的成本

### **监控工具**
```javascript
// 添加性能监控
const PERFORMANCE_METRICS = {
    trackResponseTime: (startTime) => {
        const responseTime = Date.now() - startTime;
        console.log(`响应时间: ${responseTime}ms`);
        return responseTime;
    },
    
    trackAccuracy: (userQuestion, aiResponse, userFeedback) => {
        // 记录用户反馈和准确率
        console.log(`问题: ${userQuestion}`);
        console.log(`回答: ${aiResponse}`);
        console.log(`用户反馈: ${userFeedback}`);
    }
};
```

## 🎉 **总结**

### **推荐流程**
1. **开始**: 使用 OpenRouter 进行微调
2. **数据**: 准备100-500个高质量对话样本
3. **训练**: 使用适合的基础模型
4. **测试**: 验证微调效果
5. **部署**: 集成到您的客服系统
6. **监控**: 持续优化性能

### **成本估算**
- **数据准备**: 免费 (自己收集)
- **微调训练**: $10-50 (取决于数据量)
- **使用成本**: $0.01-0.05/1000次对话

---

**开始您的AI微调之旅吧！** 🚀✨
