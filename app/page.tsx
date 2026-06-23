'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchInput } from '@/components/SearchInput';
import { WeatherCard } from '@/components/WeatherCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type Status = 'idle' | 'loading' | 'completed' | 'error';

interface WeatherResult {
  location: string;
  weather: string;
}

export default function Home() {
  const [status, setStatus] = useState<Status>('idle');
  const [weatherResult, setWeatherResult] = useState<WeatherResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  const pollTaskStatus = useCallback(async (taskId: string) => {
    const response = await fetch(`/api/weather?taskId=${taskId}`);
    const data = await response.json();

    if (data.status === 'completed') {
      setWeatherResult(data.result);
      setStatus('completed');
      setTaskId(null);
    } else if (data.status === 'failed') {
      setError(data.error || '查询失败');
      setStatus('error');
      setTaskId(null);
    } else {
      setTimeout(() => pollTaskStatus(taskId), 2000);
    }
  }, []);

  const handleSearch = async (location: string) => {
    setStatus('loading');
    setError(null);
    setWeatherResult(null);

    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      });

      if (response.status === 202) {
        const data = await response.json();
        setTaskId(data.taskId);
        pollTaskStatus(data.taskId);
      } else {
        const data = await response.json();
        setError(data.error || '查询失败');
        setStatus('error');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setError(null);
    setWeatherResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            天气查询 Agent
          </h1>
          <p className="text-white/60 text-lg">
            基于火山引擎豆包大语言模型的智能天气查询助手
          </p>
        </div>

        <div className="flex flex-col items-center">
          <SearchInput onSearch={handleSearch} disabled={status === 'loading'} />

          <div className="w-full mt-8">
            {status === 'idle' && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-white/60">输入城市名称开始查询天气</p>
              </div>
            )}

            {status === 'loading' && <LoadingSpinner />}

            {status === 'completed' && weatherResult && (
              <WeatherCard 
                location={weatherResult.location} 
                weatherText={weatherResult.weather} 
              />
            )}

            {status === 'error' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-white/80 text-lg mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                >
                  重新查询
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-white/40 text-sm">
          <p>支持长时任务处理（最长5分钟）</p>
          <p className="mt-1">基于火山引擎豆包大语言模型</p>
        </div>
      </div>
    </div>
  );
}
