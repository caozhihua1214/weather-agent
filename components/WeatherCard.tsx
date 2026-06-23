interface WeatherCardProps {
  location: string;
  weatherText: string;
}

export function WeatherCard({ location, weatherText }: WeatherCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{location}</h3>
          <p className="text-white/60 text-sm">今日天气</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4">
        <div className="prose prose-invert max-w-none">
          <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
            {weatherText}
          </p>
        </div>
      </div>
    </div>
  );
}
