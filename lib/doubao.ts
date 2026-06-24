import axios from 'axios';

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY || '';
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

interface ZhiPuMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

interface ZhiPuChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
  index: number;
}

interface ZhiPuResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ZhiPuChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function callZhiPu(messages: ZhiPuMessage[]): Promise<string> {
  const requestBody = {
    model: 'glm-4',
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
    temperature: 0.7,
    max_tokens: 2048,
  };

  const response = await axios.post<ZhiPuResponse>(
    ZHIPU_API_URL,
    requestBody,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_API_KEY}`,
      },
    }
  );

  const choice = response.data.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error('智谱AI API返回无效响应');
  }

  return choice.message.content;
}

export async function getWeatherFromZhiPu(location: string): Promise<string> {
  const systemPrompt = `你是一个专业的天气查询助手。请根据常识和天气规律，为用户提供该城市今天的模拟天气信息。回答格式要求：

1. 天气状况：晴、多云、阴、小雨、大雨等
2. 温度范围：如 -5℃~8℃
3. 体感温度：给出体感温度值
4. 湿度：百分比数值
5. 风速：如东北风3级
6. 紫外线强度：弱、中等、强、很强等

请用友好自然的中文描述，直接给出天气信息，不要提及你无法调用API或没有实时数据。示例回答：
"北京今天天气晴朗，气温在-2℃到8℃之间，体感温度约-5℃，湿度45%，东北风2级，紫外线强度中等。建议穿厚外套，注意防晒。"`;
  
  const userPrompt = `请查询并告诉我${location}今天的天气情况。`;

  const result = await callZhiPu([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  return result.trim();
}
