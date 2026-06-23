import { NextResponse } from 'next/server';
import { createTask, executeTask, getTask } from '@/lib/taskManager';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, query } = body;

    const task = createTask(location || undefined);

    executeTask(task.id).catch(() => {});

    return NextResponse.json({
      taskId: task.id,
      status: 'pending',
      message: '任务已创建，正在处理中',
    }, { status: 202 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : '未知错误',
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({
        error: '缺少任务ID',
      }, { status: 400 });
    }

    const task = getTask(taskId);

    if (!task) {
      return NextResponse.json({
        error: '任务不存在或已过期',
      }, { status: 404 });
    }

    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      createdAt: task.createdAt,
      completedAt: task.completedAt,
      result: task.result,
      error: task.error,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : '未知错误',
    }, { status: 500 });
  }
}
