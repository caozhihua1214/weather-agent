import axios from 'axios';
import type { DoubaoMessage, DoubaoResponse } from '@/types';

const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY || '';

export async function callDoubao(messages: DoubaoMessage[]): Promise<string> {
  const response = await axios.post<DoubaoResponse>(
    'https://api.doubao.com/v1/chat/completions',
    {
      model: 'doubao-3.5',
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      },
    }
  );

  const choice = response.data.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error('豆包 API 返回无效响应');
  }

  return choice.message.content;
}

export async function getWeatherFromDoubao(location: string): Promise<string> {
  const messages: DoubaoMessage[] = [
    {
      role: 'system',
      content: '你是一个专业的天气查询助手。请提供准确、详细的天气信息，包括温度、天气状况、湿度、风速等。回答用中文，友好自然。',
    },
    {
      role: 'user',
      content: `请查询并告诉我${location}今天的天气情况，包括：当前温度、体感温度、天气状况（晴/多云/阴/雨等）、湿度、风速、紫外线强度等信息。`,
    },
  ];

  const result = await callDoubao(messages);
  return result.trim();
}
