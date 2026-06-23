interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = '正在查询天气...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-spin border-t-white"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin border-b-white" style={{ animationDuration: '1.5s' }}></div>
      </div>
      <p className="mt-6 text-white/80 text-lg">{message}</p>
      <p className="mt-2 text-white/40 text-sm">任务可能需要几分钟时间，请耐心等待...</p>
    </div>
  );
}
