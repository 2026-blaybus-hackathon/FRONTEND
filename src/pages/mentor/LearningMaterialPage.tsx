import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Folder, FileText, Download, Pencil, Trash2, Plus, X } from 'lucide-react';
import { cn } from '../../libs/utils';
import MarkdownEditor from '../../components/common/markdown/MarkdownEditor';
import MarkdownRenderer from '../../components/common/markdown/MarkdownRenderer';
import { useMaterials } from '../../hooks/task/useMaterials';
import { getMaterialFileBlob, createMaterial, deleteMaterial } from '../../api/materials';
import type { LearningMaterialItem, MaterialRegisterRequest } from '../../libs/types/material';

const TABS = [
  { id: 'weakness', label: '약점 보완 솔루션', taskType: 'WEAKNESS_SOLUTION' as const },
  { id: 'column', label: '서울대쌤 칼럼', taskType: 'COLUMN' as const },
] as const;

type TabId = (typeof TABS)[number]['id'];

const SUBJECT_LABEL: Record<string, string> = {
  KOREAN: '국어',
  MATH: '수학',
  ENGLISH: '영어',
};

function formatMaterialDate(iso: string): string {
  try {
    const d = new Date(iso);
    const y = String(d.getFullYear()).slice(2);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  } catch {
    return '-';
  }
}

function getFileUrl(fileUrl: string): string {
  if (!fileUrl) return '';
  return fileUrl.startsWith('http') ? fileUrl : `https://${fileUrl}`;
}

/** Blob을 파일로 다운로드 */
function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'download';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** URL을 fetch 후 다운로드. 실패 시 새 탭으로 연다 */
async function triggerDownloadFromUrl(url: string, fileName: string): Promise<void> {
  try {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    downloadBlob(blob, fileName);
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

const FAB_MENU_ITEMS: { id: TabId; label: string; taskType: 'WEAKNESS_SOLUTION' | 'COLUMN' }[] = [
  { id: 'weakness', label: '약점보완솔루션 등록', taskType: 'WEAKNESS_SOLUTION' },
  { id: 'column', label: '칼럼 작성', taskType: 'COLUMN' },
];

const SUBJECT_OPTIONS = [
  { value: 'KOREAN', label: '국어' },
  { value: 'MATH', label: '수학' },
  { value: 'ENGLISH', label: '영어' },
];

const LearningMaterialPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>('weakness');
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registerTaskType, setRegisterTaskType] = useState<'COLUMN' | 'WEAKNESS_SOLUTION'>('WEAKNESS_SOLUTION');
  const [registerForm, setRegisterForm] = useState({ title: '', subject: 'KOREAN', content: '' });
  const [registerFile, setRegisterFile] = useState<File | null>(null);
  const [registerSubmitting, setRegisterSubmitting] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  const currentTaskType = TABS.find((t) => t.id === activeTab)?.taskType;
  const { materials, isLoading } = useMaterials(currentTaskType);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [detailMaterial, setDetailMaterial] = useState<LearningMaterialItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDownload = async (item: LearningMaterialItem) => {
    const fileName = item.originalFileName || `${item.title}.pdf`;
    setDownloadingId(item.id);
    try {
      try {
        const blob = await getMaterialFileBlob(item.id);
        downloadBlob(blob, fileName);
      } catch {
        const url = getFileUrl(item.fileUrl);
        if (url) await triggerDownloadFromUrl(url, fileName);
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (item: LearningMaterialItem) => {
    if (!window.confirm(`"${item.title}" 학습 자료를 삭제할까요?`)) return;
    setDeletingId(item.id);
    try {
      await deleteMaterial(item.id);
      await queryClient.invalidateQueries({ queryKey: ['materials'] });
      if (detailMaterial?.id === item.id) setDetailMaterial(null);
      alert('삭제되었습니다.');
    } catch (err) {
      console.error(err);
      alert('삭제에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) setFabMenuOpen(false);
    };
    if (fabMenuOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [fabMenuOpen]);

  const handleFabMenuItem = (taskType: 'WEAKNESS_SOLUTION' | 'COLUMN') => {
    setFabMenuOpen(false);
    setRegisterTaskType(taskType);
    setRegisterForm({ title: '', subject: 'KOREAN', content: '' });
    setRegisterFile(null);
    setRegisterModalOpen(true);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.title.trim()) {
      alert('제목을 입력해 주세요.');
      return;
    }
    // 칼럼: 글(content)로 등록. 약점 보완 솔루션: PDF 파일 필수.
    if (registerTaskType === 'WEAKNESS_SOLUTION') {
      if (!registerFile) {
        alert('약점 보완 솔루션은 PDF 파일을 첨부해 주세요.');
        return;
      }
    }
    setRegisterSubmitting(true);
    try {
      const request: MaterialRegisterRequest = {
        title: registerForm.title.trim(),
        taskType: registerTaskType,
        subject: registerForm.subject,
        content: registerForm.content.trim(),
      };
      const fileToSend = registerTaskType === 'WEAKNESS_SOLUTION' ? registerFile ?? undefined : undefined;
      await createMaterial(request, fileToSend);
      await queryClient.invalidateQueries({ queryKey: ['materials'] });
      setRegisterModalOpen(false);
      setRegisterForm({ title: '', subject: 'KOREAN', content: '' });
      setRegisterFile(null);
      alert('학습 자료가 등록되었습니다.');
    } catch (err) {
      console.error(err);
      alert('등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setRegisterSubmitting(false);
    }
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
        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-500">학습 자료를 불러오는 중...</div>
        ) : materials.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">등록된 학습 자료가 없습니다.</div>
        ) : (
          materials.map((item: LearningMaterialItem) => {
            const downloadUrl = getFileUrl(item.fileUrl);
            return (
              <article
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => setDetailMaterial(item)}
                onKeyDown={(e) => e.key === 'Enter' && setDetailMaterial(item)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 cursor-pointer hover:border-[var(--color-primary-200)] hover:shadow-md transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 shrink-0">
                      {SUBJECT_LABEL[item.subject] ?? item.subject}
                    </span>
                    <h2 className="text-base font-semibold text-gray-900 m-0 truncate">{item.title}</h2>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      aria-label="수정"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                      disabled={deletingId === item.id}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600 disabled:opacity-50"
                      aria-label="삭제"
                    >
                      {deletingId === item.id ? (
                        <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" aria-hidden />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    {downloadUrl || item.fileUrl ? (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDownload(item); }}
                        disabled={downloadingId === item.id}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                        aria-label="다운로드"
                      >
                        {downloadingId === item.id ? (
                          <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" aria-hidden />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <span className="p-2 rounded-lg text-gray-300" aria-hidden><Download className="w-4 h-4" /></span>
                    )}
                  </div>
                </div>
                {/* 파일 첨부 영역 */}
                <div className="flex items-center justify-between gap-3 py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-gray-500 shrink-0" aria-hidden />
                    <span className="text-sm text-gray-800 truncate">{item.originalFileName || '(파일 없음)'}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {(downloadUrl || item.fileUrl) ? (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDownload(item); }}
                        disabled={downloadingId === item.id}
                        className="p-1.5 rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50"
                        aria-label="다운로드"
                      >
                        {downloadingId === item.id ? (
                          <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" aria-hidden />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    ) : null}
                    <span className="text-sm text-gray-500">{formatMaterialDate(item.createdDateTime)}</span>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* 학습 자료 상세 모달 */}
      {detailMaterial && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDetailMaterial(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="material-detail-title"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                    {SUBJECT_LABEL[detailMaterial.subject] ?? detailMaterial.subject}
                  </span>
                  <span className="text-xs text-gray-500">
                    {detailMaterial.taskType === 'COLUMN' ? '칼럼' : '약점 보완 솔루션'} · {formatMaterialDate(detailMaterial.createdDateTime)}
                  </span>
                </div>
                <h2 id="material-detail-title" className="text-lg font-bold text-gray-900 m-0 truncate">
                  {detailMaterial.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {(getFileUrl(detailMaterial.fileUrl) || detailMaterial.fileUrl) && (
                  <button
                    type="button"
                    onClick={() => handleDownload(detailMaterial)}
                    disabled={downloadingId === detailMaterial.id}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 flex items-center gap-1.5 text-sm"
                  >
                    {downloadingId === detailMaterial.id ? (
                      <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" aria-hidden />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    다운로드
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(detailMaterial)}
                  disabled={deletingId === detailMaterial.id}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600 disabled:opacity-50 flex items-center gap-1.5 text-sm"
                  aria-label="삭제"
                >
                  {deletingId === detailMaterial.id ? (
                    <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" aria-hidden />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  삭제
                </button>
                <button
                  type="button"
                  onClick={() => setDetailMaterial(null)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              {detailMaterial.taskType === 'COLUMN' ? (
                <div className="prose prose-sm max-w-none min-w-0">
                  {detailMaterial.content?.trim() ? (
                    <MarkdownRenderer markdown={detailMaterial.content} />
                  ) : (
                    <p className="text-gray-500 m-0">등록된 내용이 없습니다.</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {detailMaterial.content?.trim() && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap m-0">{detailMaterial.content}</p>
                    </div>
                  )}
                  {detailMaterial.originalFileName && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <FileText className="w-5 h-5 text-gray-500 shrink-0" />
                      <span className="text-sm text-gray-800">{detailMaterial.originalFileName}</span>
                      <button
                        type="button"
                        onClick={() => handleDownload(detailMaterial)}
                        disabled={downloadingId === detailMaterial.id}
                        className="ml-auto p-2 rounded-lg text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] disabled:opacity-50 text-sm font-medium"
                      >
                        {downloadingId === detailMaterial.id ? '다운로드 중...' : 'PDF 다운로드'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FAB + 메뉴: 약점보완솔루션 등록 / 칼럼 작성 */}
      <div ref={fabRef} className="fixed bottom-8 right-8 flex flex-col items-end gap-2">
        {fabMenuOpen && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg py-1 min-w-[200px]">
            {FAB_MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleFabMenuItem(item.taskType)}
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

      {/* 학습 자료 등록 모달 */}
      {registerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !registerSubmitting && setRegisterModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-material-title"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 id="register-material-title" className="text-lg font-bold text-gray-900 m-0">
                학습 자료 등록
              </h2>
              <button
                type="button"
                onClick={() => !registerSubmitting && setRegisterModalOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 p-6 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-title">
                  제목
                </label>
                <input
                  id="reg-title"
                  type="text"
                  value={registerForm.title}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder={registerTaskType === 'COLUMN' ? '예: 3월 모의고사 대비 국어 칼럼' : '예: 수학 오답노트 작성법'}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-subject">
                  과목
                </label>
                <select
                  id="reg-subject"
                  value={registerForm.subject}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                >
                  {SUBJECT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-content">
                  {registerTaskType === 'COLUMN' ? '내용 (마크다운으로 작성)' : '설명 (선택)'}
                </label>
                {registerTaskType === 'COLUMN' ? (
                  <div className="border border-gray-300 rounded-lg overflow-hidden min-h-[280px]">
                    <MarkdownEditor
                      value={registerForm.content}
                      setValue={(v) => setRegisterForm((f) => ({ ...f, content: v }))}
                      height="280px"
                    />
                  </div>
                ) : (
                  <textarea
                    id="reg-content"
                    value={registerForm.content}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, content: e.target.value }))}
                    placeholder="자료에 대한 간단한 설명을 입력하세요."
                    rows={4}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  />
                )}
              </div>
              {registerTaskType === 'WEAKNESS_SOLUTION' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-file">
                    PDF 파일 <span className="text-red-500">(필수)</span>
                  </label>
                  <input
                    id="reg-file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => setRegisterFile(e.target.files?.[0] ?? null)}
                    className="w-full text-sm text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary-50)] file:text-[var(--color-primary-600)]"
                  />
                  <p className="text-xs text-gray-500 mt-1 m-0">약점 보완 솔루션은 PDF로 등록됩니다.</p>
                  {registerFile && (
                    <p className="text-sm text-gray-700 mt-1 m-0 font-medium">{registerFile.name}</p>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  disabled={registerSubmitting}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={registerSubmitting}
                  className="px-4 py-2.5 rounded-lg bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] disabled:opacity-50 font-medium"
                >
                  {registerSubmitting ? '등록 중...' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningMaterialPage;
