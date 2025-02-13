'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SchoolInfo {
  SD_SCHUL_CODE: string;  // 행정표준코드
  SCHUL_NM: string;       // 학교명
  ORG_RDNMA: string;      // 도로명주소
}

interface SchoolInfoResponse {
  schoolInfo?: [
    { head: [{ list_total_count: number }] },
    { row: SchoolInfo[] },
  ]
}

interface EducationOffice {
  code: string;
  name: string;
}

const EDUCATION_OFFICES: EducationOffice[] = [
  { code: '', name: '전체' },
  { code: 'B10', name: '서울특별시교육청' },
  { code: 'C10', name: '부산광역시교육청' },
  { code: 'D10', name: '대구광역시교육청' },
  { code: 'E10', name: '인천광역시교육청' },
  { code: 'F10', name: '광주광역시교육청' },
  { code: 'G10', name: '대전광역시교육청' },
  { code: 'H10', name: '울산광역시교육청' },
  { code: 'I10', name: '세종특별자치시교육청' },
  { code: 'J10', name: '경기도교육청' },
  { code: 'K10', name: '강원특별자치도교육청' },
  { code: 'M10', name: '충청북도교육청' },
  { code: 'N10', name: '충청남도교육청' },
  { code: 'P10', name: '전북특별자치도교육청' },
  { code: 'Q10', name: '전라남도교육청' },
  { code: 'R10', name: '경상북도교육청' },
  { code: 'S10', name: '경상남도교육청' },
  { code: 'T10', name: '제주특별자치도교육청' },
  { code: 'V10', name: '재외한국학교교육청' },
];



export default function Home() {
  const [schoolName, setSchoolName] = useState<string>('');
  const [office, setOffice] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SchoolInfo[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>(0);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSearching(true);
    try {
      const url = new URL('https://open.neis.go.kr/hub/schoolInfo');
      url.searchParams.set('Type', 'json');
      url.searchParams.set('SCHUL_NM', schoolName);
      if (office) {
        url.searchParams.set('ATPT_OFCDC_SC_CODE', office);
      }

      const response = await fetch(url);
      const data: SchoolInfoResponse = await response.json();

      if (data.schoolInfo) {
        setTotalResults(data.schoolInfo[0].head[0].list_total_count);
        setSearchResults(data.schoolInfo[1].row);
      } else {
        setTotalResults(0);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      alert('학교 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight
            bg-gradient-to-r from-blue-700 to-blue-500
            bg-clip-text text-transparent">
            scal
          </h1>
          <div className="space-y-4">
            <p className="text-xl sm:text-2xl font-medium text-blue-900">
              초중고 학사일정 캘린더 서비스
            </p>
            <div className="space-y-3 max-w-xl mx-auto">
              <p className="text-base sm:text-lg text-blue-700">
                구글 캘린더 등에 추가해서 사용할수 있는<br />
                맞춤형 ical 주소를 제공합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8
            border border-blue-100">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="schoolName"
                    className="block text-lg font-medium text-blue-900 mb-2">
                    학교 검색
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="학교 이름을 입력하세요"
                    className="w-full px-4 py-3 rounded-xl
                      border-2 border-blue-200
                      focus:border-blue-400 focus:ring-2
                      focus:ring-blue-200 focus:outline-none
                      transition-all duration-200
                      placeholder:text-blue-300"
                    required
                    minLength={2}
                  />
                </div>

                <div>
                  <label htmlFor="educationOffice"
                    className="block text-lg font-medium text-blue-900 mb-2">
                    교육청 선택
                  </label>
                  <select
                    id="educationOffice"
                    value={office}
                    onChange={(e) => setOffice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl
                      border-2 border-blue-200
                      focus:border-blue-400 focus:ring-2
                      focus:ring-blue-200 focus:outline-none
                      transition-all duration-200
                      bg-white"
                  >
                    {EDUCATION_OFFICES.map((office) => (
                      <option key={office.code} value={office.code}>
                        {office.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-4 px-6 rounded-xl font-medium
                  bg-blue-600 text-white
                  hover:bg-blue-700 active:scale-[0.99]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200"
              >
                {isSearching ? '검색중...' : '우리 학교 찾기'}
              </button>
            </form>
          </div>

          {/* Results Section */}
          {(searchResults.length > 0 || isSearching) && (
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 sm:p-8
              border border-blue-100">
              <h2 className="text-lg font-semibold mb-4 text-blue-900">
                검색 결과
              </h2>
              {totalResults > 0 && (
                <p className="text-sm text-blue-600 mb-4">
                  {totalResults}개의 학교를 찾았습니다
                </p>
              )}
              <ul className="divide-y divide-blue-100">
                {searchResults.map((school) => (
                  <li
                    key={school.SD_SCHUL_CODE}
                    className="py-4 hover:bg-blue-50 cursor-pointer
                      rounded-lg px-3 transition-all duration-200"
                  >
                    <Link href={{ pathname: '/school', query: { code: school.SD_SCHUL_CODE, name: school.SCHUL_NM } }}>
                      <div className="flex flex-col">
                        <span className="font-medium text-blue-900 text-lg">
                          {school.SCHUL_NM}
                        </span>
                        <span className="text-sm text-blue-600 mt-1">
                          {school.ORG_RDNMA}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
