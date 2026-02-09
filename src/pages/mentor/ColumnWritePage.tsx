import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, ChevronDown } from 'lucide-react';
import MarkdownEditor from '../../components/common/markdown/MarkdownEditor';

const COLUMN_TYPES = [
  '생활 습관 & 동기 부여',
  '학습법',
  '진로 & 진학',
  '심리 & 마음',
  '기타',
] as const;

const ColumnWritePage = () => {
  const [columnType, setColumnType] = useState<string>(COLUMN_TYPES[0]);
  const [title, setTitle] = useState('짧은 시간의 힘, 자투리 10분이 성적을 바꾼다');
  const [content, setContent] = useState(
    '## Heading 6\n\n**Chapter 1, The History**\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  );
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  const handleTempSave = () => {
    console.log('[ColumnWrite] 임시 저장', { columnType, title, content });
    alert('임시 저장되었습니다.');
  };

  const handlePublish = () => {
    console.log('[ColumnWrite] 발행', { columnType, title, content });
    alert('발행되었습니다.');
  };

  return (
    <div className="main-content flex flex-col gap-6 bg-[var(--color-primary-50)] min-h-full">
      {/* 브레드크럼 */}
      <nav className="text-sm text-[var(--color-text-muted)]" aria-label="breadcrumb">
        <Link
          to="/mentor"
          className="text-[var(--color-text-muted)] no-underline hover:text-[var(--color-primary-500)]"
        >
          Desktop
        </Link>
        <span className="mx-2">/</span>
        <Link
          to="/mentor/material"
          className="text-[var(--color-text-muted)] no-underline hover:text-[var(--color-primary-500)]"
        >
          학습 자료 관리
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary-500)] font-medium">칼럼 작성</span>
      </nav>

      {/* 카드: 컬럼 작성 폼 */}
      <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
        {/* 상단: 제목 + 작성 정보 + 액션 버튼 */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-100)] flex items-center justify-center shrink-0">
              <Pencil className="w-5 h-5 text-[var(--color-primary-500)]" aria-hidden />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 m-0">컬럼 작성하기</h1>
              <p className="text-sm text-gray-500 m-0 mt-1">26.02.08 15:32:20 · 최은지</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleTempSave}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              임시 저장
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="px-4 py-2 rounded-lg bg-[var(--color-primary-500)] text-white text-sm font-medium hover:opacity-90"
            >
              발행하기
            </button>
          </div>
        </div>

        {/* 컬럼 유형 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">컬럼 유형</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setTypeDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm hover:border-gray-400"
            >
              <span>{columnType}</span>
              <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" aria-hidden />
            </button>
            {typeDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setTypeDropdownOpen(false)}
                />
                <ul
                  className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-auto"
                  role="listbox"
                >
                  {COLUMN_TYPES.map((type) => (
                    <li key={type} role="option">
                      <button
                        type="button"
                        onClick={() => {
                          setColumnType(type);
                          setTypeDropdownOpen(false);
                        }}
                        className={`
                          w-full px-3 py-2 text-left text-sm
                          ${columnType === type ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)]' : 'text-gray-700 hover:bg-gray-50'}
                        `}
                      >
                        {type}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)]"
            placeholder="제목을 입력하세요"
          />
        </div>

        {/* 본문 에디터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">본문</label>
          <div className="min-h-[320px] rounded-lg border border-gray-200 overflow-hidden">
            <MarkdownEditor
              value={content}
              setValue={setContent}
              height="320px"
            />
          </div>
        </div>
      </article>
    </div>
  );
};

export default ColumnWritePage;
