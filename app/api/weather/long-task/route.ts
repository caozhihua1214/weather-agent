import { NextResponse } from 'next/server';
import { createTask, executeTask, getTask } from '@/lib/taskManager';

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, delay = 0 } = body;

    const task = createTask(location);
    
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    await executeTask(task.id);

    const completedTask = getTask(task.id);

    return NextResponse.json({
      taskId: task.id,
      status: completedTask?.status || 'failed',
      result: completedTask?.result,
      error: completedTask?.error,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : '未知错误',
    }, { status: 500 });
  }
}
