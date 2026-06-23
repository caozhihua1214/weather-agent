import axios from 'axios';

const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY || '';
const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/responses';

interface DoubaoContentItem {
  type: 'input_text';
  text: string;
}

interface DoubaoInput {
  role: 'user';
  content: DoubaoContentItem[];
}

interface DoubaoRequest {
  model: string;
  input: DoubaoInput[];
}

interface DoubaoResponse {
  id: string;
  model: string;
  output: {
    choices: {
      message: {
        role: string;
        content: {
          type: string;
          text: string;
        }[];
      };
    }[];
  };
}

export async function callDoubao(messages: { role: string; content: string }[]): Promise<string> {
  const userMessage = messages.find(m => m.role === 'user');
  const systemMessage = messages.find(m => m.role === 'system');

  let prompt = userMessage?.content || '';
  if (systemMessage) {
    prompt = `${systemMessage.content}\n\n${prompt}`;
  }

  const requestBody: DoubaoRequest = {
    model: 'doubao-seed-2-1-pro-260628',
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: prompt,
          },
        ],
      },
    ],
  };

  const response = await axios.post<DoubaoResponse>(
    DOUBAO_API_URL,
    requestBody,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      },
    }
  );

  const choices = response.data.output?.choices;
  if (!choices || choices.length === 0) {
    throw new Error('豆包 API 返回无效响应');
  }

  const content = choices[0]?.message?.content;
  if (!content || content.length === 0) {
    throw new Error('豆包 API 返回无效内容');
  }

  return content[0]?.text || '';
}

export async function getWeatherFromDoubao(location: string): Promise<string> {
  const systemPrompt = '你是一个专业的天气查询助手。请提供准确、详细的天气信息，包括温度、天气状况、湿度、风速等。回答用中文，友好自然。';
  const userPrompt = `请查询并告诉我${location}今天的天气情况，包括：当前温度、体感温度、天气状况（晴/多云/阴/雨等）、湿度、风速、紫外线强度等信息。`;

  const result = await callDoubao([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  return result.trim();
}
