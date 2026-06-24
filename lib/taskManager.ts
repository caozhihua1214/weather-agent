import { v4 as uuidv4 } from 'uuid';
import type { Task } from '@/types';

const tasks = new Map<string, Task>();

const MAX_TASK_DURATION = 5 * 60 * 1000;
const CLEANUP_INTERVAL = 10 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  tasks.forEach((task, id) => {
    if (now - task.createdAt > MAX_TASK_DURATION) {
      tasks.delete(id);
    }
  });
}, CLEANUP_INTERVAL);

export function createTask(location?: string): Task {
  const task: Task = {
    id: uuidv4(),
    status: 'pending',
    createdAt: Date.now(),
    location,
  };
  tasks.set(task.id, task);
  return task;
}

export function getTask(id: string): Task | undefined {
  return tasks.get(id);
}

export function updateTask(id: string, updates: Partial<Task>): void {
  const task = tasks.get(id);
  if (task) {
    tasks.set(id, { ...task, ...updates });
  }
}

export function completeTask(id: string, result: any): void {
  const task = tasks.get(id);
  if (task) {
    tasks.set(id, {
      ...task,
      status: 'completed',
      result,
      completedAt: Date.now(),
    });
  }
}

export function failTask(id: string, error: string): void {
  const task = tasks.get(id);
  if (task) {
    tasks.set(id, {
      ...task,
      status: 'failed',
      error,
      completedAt: Date.now(),
    });
  }
}

export async function executeTask(taskId: string): Promise<void> {
  const task = tasks.get(taskId);
  if (!task) {
    throw new Error('任务不存在');
  }

  updateTask(taskId, { status: 'running' });

  try {
    const { getWeatherFromZhiPu } = await import('./doubao');

    const location = task.location || '北京';
    
    if (!location || location === '未知') {
      throw new Error('无法识别位置');
    }

    const weatherData = await getWeatherFromZhiPu(location);
    
    completeTask(taskId, { weather: weatherData, location });
  } catch (error) {
    failTask(taskId, error instanceof Error ? error.message : '未知错误');
  }
}
