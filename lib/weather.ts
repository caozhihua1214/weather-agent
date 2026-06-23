import axios from 'axios';
import type { WeatherResponse } from '@/types';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '';
const WEATHER_API_URL = process.env.WEATHER_API_URL || 'https://api.weatherapi.com/v1/current.json';

export async function getWeather(location: string): Promise<WeatherResponse> {
  const response = await axios.get<WeatherResponse>(WEATHER_API_URL, {
    params: {
      key: WEATHER_API_KEY,
      q: location,
      aqi: 'no',
    },
  });

  return response.data;
}

export async function getWeatherWithRetry(location: string, retries: number = 3): Promise<WeatherResponse> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await getWeather(location);
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }

  throw lastError || new Error('天气查询失败');
}
