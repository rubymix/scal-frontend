'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const DEFAULT_LUNCHTIME_DURATION = '50';

interface CalendarConfig {
  schoolCode: string;
  grade?: string;
  class?: string;
  lunchStart?: string;
  lunchDuration: string;
}

const buildUrl = (config: CalendarConfig): string => {
  const url = new URL(`https://scal.sulhee.com/calendars/${config.schoolCode}/school.ics`);

  if (config.grade) {
    url.searchParams.set('grade', config.grade);
    if (config.class) {
      url.searchParams.set('class', config.class);
    }
  }

  if (config.lunchStart) {
    url.searchParams.set('lunch', config.lunchStart.replace(':', ''));
    url.searchParams.set('lunchmins', config.lunchDuration);
  }

  return url.toString();
};

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const schoolCode = searchParams.get('code') ?? '';
  const schoolName = searchParams.get('name');

  const [calendarUrl, setCalendarUrl] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [klass, setKlass] = useState<string>('');
  const [lunchStart, setLunchStart] = useState<string>('');
  const [lunchDuration, setLunchDuration] = useState<string>(DEFAULT_LUNCHTIME_DURATION);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const url = buildUrl({
      schoolCode,
      grade,
      class: klass,
      lunchStart,
      lunchDuration: lunchDuration || DEFAULT_LUNCHTIME_DURATION,
    });

    setCalendarUrl(url);
  }, [schoolCode, grade, klass, lunchStart, lunchDuration]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(calendarUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('URL 복사 실패:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <nav className="p-4">
        <button onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
          text-sky-700 hover:bg-sky-100 transition-all duration-200">
          ← 홈으로
        </button>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto space-y-6">
          {/* School Info and Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
            <h1 className="text-2xl font-bold text-sky-900 text-center mb-6">
              {schoolName}
            </h1>

            {/* Settings Form */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-sky-800">학년/반 설정</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sky-700 mb-2">
                      학년 (선택)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-sky-200
                        focus:border-sky-400 focus:ring-2 focus:ring-sky-200
                        focus:outline-none transition-all duration-200"
                    />
                  </div>
                  {grade && (
                    <div>
                      <label className="block text-sm font-medium text-sky-700 mb-2">
                        반 (선택)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={klass}
                        onChange={(e) => setKlass(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-sky-200
                          focus:border-sky-400 focus:ring-2 focus:ring-sky-200
                          focus:outline-none transition-all duration-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-sky-100 space-y-4">
                <h2 className="text-lg font-medium text-sky-800">점심시간 설정</h2>
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-2">
                    시작 시간 (선택)
                  </label>
                  <input
                    type="time"
                    value={lunchStart}
                    onChange={(e) => setLunchStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-sky-200
                      focus:border-sky-400 focus:ring-2 focus:ring-sky-200
                      focus:outline-none transition-all duration-200"
                  />
                </div>
                {lunchStart && (
                  <div>
                    <label className="block text-sm font-medium text-sky-700 mb-2">
                      점심 시간 (분)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={lunchDuration}
                      onChange={(e) => setLunchDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-sky-200
                        focus:border-sky-400 focus:ring-2 focus:ring-sky-200
                        focus:outline-none transition-all duration-200"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Calendar URL Display - Moved to bottom */}
            <div className="mt-8 pt-6 border-t border-sky-100">
              <label className="block text-sm font-medium text-sky-700 mb-2">
                캘린더 URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={calendarUrl}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-sky-200
                    text-sky-900 text-sm"
                />
                <button
                  onClick={handleCopyUrl}
                  className={`shrink-0 px-4 py-2 rounded-lg font-medium text-white
                    ${copySuccess ? 'bg-green-500' : 'bg-sky-600 hover:bg-sky-700'}
                    transition-all duration-200`}
                >
                  {copySuccess ? '복사 완료!' : '복사'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


export default function School() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}
