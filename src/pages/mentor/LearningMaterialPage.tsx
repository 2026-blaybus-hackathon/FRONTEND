import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Folder, FileText, Download, Pencil, Trash2, Plus } from 'lucide-react';
import { cn } from '../../libs/utils';

const TABS = [
  { id: 'weakness', label: '약점 보완 솔루션' },
  { id: 'column', label: '서울대쌤 칼럼' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/** 학습 자료 카드 목록 (목업) */
const MOCK_MATERIALS = [
  {
    id: 1,
    category: '국어',
    title: '매3비 2지문',
    fileName: '언어(문법) 오답노트.pdf',
    date: '26.02.07',
  },
];

const FAB_MENU_ITEMS = [
  { id: 'weakness', label: '약점보완솔루션 등록', path: null },
  { id: 'column', label: '칼럼 작성', path: '/mentor/material/column' as const },
] as const;

const LearningMaterialPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>('weakness');
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) setFabMenuOpen(false);
    };
    if (fabMenuOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [fabMenuOpen]);

  const handleFabMenuItem = (path: string | null) => {
    setFabMenuOpen(false);
    if (path) navigate(path);
    // 약점보완솔루션 등록은 추후 구현
  };

  return (
    <div className="main-content flex flex-col gap-6 bg-[var(--color-primary-50)] min-h-full pb-20 relative">
      {/* 브레드크럼 */}
      <nav className="text-sm text-[var(--color-text-muted)]" aria-label="breadcrumb">
        <Link
          to="/mentor"
          className="text-[var(--color-text-muted)] no-underline hover:text-[var(--color-primary-500)]"
        >
          Desktop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary-500)] font-medium">학습 자료 관리</span>
      </nav>

      {/* 타이틀 + 아이콘 */}
      <section className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-100)] flex items-center justify-center shrink-0">
          <Folder className="w-7 h-7 text-[var(--color-primary-500)]" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 m-0">학습 자료 관리</h1>
      </section>

      {/* 탭: 약점 보완 솔루션 / 서울대쌤 칼럼 */}
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-[var(--color-primary-100)] border-[var(--color-primary-200)] text-[var(--color-primary-600)]'
                : 'bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            <FileText className="w-4 h-4 shrink-0" aria-hidden />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 자료 카드 목록 */}
      <div className="flex flex-col gap-4">
        {MOCK_MATERIALS.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 shrink-0">
                  {item.category}
                </span>
                <h2 className="text-base font-semibold text-gray-900 m-0 truncate">{item.title}</h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="수정"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600"
                  aria-label="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="다운로드"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* 파일 첨부 영역 */}
            <div className="flex items-center justify-between gap-3 py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-5 h-5 text-gray-500 shrink-0" aria-hidden />
                <span className="text-sm text-gray-800 truncate">{item.fileName}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  aria-label="다운로드"
                >
                  <Download className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500">{item.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* FAB + 메뉴: 약점보완솔루션 등록 / 칼럼 작성 */}
      <div ref={fabRef} className="fixed bottom-8 right-8 flex flex-col items-end gap-2">
        {fabMenuOpen && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg py-1 min-w-[200px]">
            {FAB_MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleFabMenuItem(item.path)}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setFabMenuOpen((prev) => !prev)}
          className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
          aria-label="학습 자료 추가"
          aria-expanded={fabMenuOpen}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default LearningMaterialPage;
