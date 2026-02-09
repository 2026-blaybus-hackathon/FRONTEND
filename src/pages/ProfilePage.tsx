import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import {
  useMenteeProfile,
  useUpdateMenteeProfile,
  useUpdateMenteeProfileImage,
} from '../hooks/useMenteeProfile';
import type { MenteeGrade } from '../libs/types/mentee';
import { getProfileImageUrl } from '../libs/utils';
import '../styles/pages/my-page.css';

const GRADE_OPTIONS: { value: MenteeGrade; label: string }[] = [
  { value: 'FIRST', label: '1학년' },
  { value: 'SECOND', label: '2학년' },
  { value: 'THIRD', label: '3학년' },
  { value: 'DROPOUT', label: '자퇴생' },
  { value: 'GRADUATED', label: '졸업생' },
];

const GRADE_BY_LABEL: Record<string, MenteeGrade> = {
  '1학년': 'FIRST',
  '2학년': 'SECOND',
  '3학년': 'THIRD',
  자퇴생: 'DROPOUT',
  졸업생: 'GRADUATED',
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const nickname = useAuthStore((state) => state.nickname);

  const isMentee = pathname.startsWith('/mentee');
  const basePath = isMentee ? '/mentee' : '/mentor';
  const myPagePath = `${basePath}/my-page`;

  const canEditProfile = role === 'MENTEE' || role === 'MENTOR';
  const { data: profile, isLoading: profileLoading } = useMenteeProfile({
    enabled: canEditProfile,
  });
  const updateProfile = useUpdateMenteeProfile();
  const updateProfileImage = useUpdateMenteeProfileImage();

  const [form, setForm] = useState({
    name: '',
    schoolName: '',
    grade: null as MenteeGrade | null,
    targetSchool: '',
    targetDate: '',
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? '',
        schoolName: profile.schoolName ?? '',
        grade: profile.grade ? GRADE_BY_LABEL[profile.grade] ?? null : null,
        targetSchool: profile.targetSchool ?? '',
        targetDate: '',
      });
    }
  }, [profile]);

  const displayName = user?.name || nickname || profile?.name || '사용자';
  const initial = displayName[0] || '?';
  const school = user?.school || profile?.schoolName || '학교 정보 없음';
  const profileImageUrl = getProfileImageUrl(profile?.profileUrl);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (!form.targetSchool.trim()) {
      alert('목표 학교를 입력해 주세요.');
      return;
    }
    if (!form.targetDate) {
      alert('목표일을 선택해 주세요.');
      return;
    }
    try {
      await updateProfile.mutateAsync({
        name: form.name.trim(),
        schoolName: form.schoolName.trim() || null,
        grade: form.grade,
        targetSchool: form.targetSchool.trim(),
        targetDate: form.targetDate,
      });
      if (profileFile) {
        await updateProfileImage.mutateAsync(profileFile);
        setProfileFile(null);
      }
      alert('프로필이 저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const inputCls =
    'w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]';

  useEffect(() => {
    if (!canEditProfile) {
      navigate(myPagePath, { replace: true });
    }
  }, [canEditProfile, myPagePath, navigate]);

  if (!canEditProfile) return null;

  return (
    <div className="my-page">
      <button
        type="button"
        onClick={() => navigate(myPagePath)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 p-0 border-0 bg-transparent cursor-pointer"
        aria-label="마이페이지로 돌아가기"
      >
        <ArrowLeft size={18} />
        마이페이지로 돌아가기
      </button>

      <div className="my-page__profile card">
        <div className="my-page__avatar" aria-hidden>
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt=""
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            initial
          )}
        </div>
        <div className="my-page__profile-info">
          <h1 className="my-page__name">{displayName}</h1>
          <p className="my-page__meta">{school}</p>
        </div>
      </div>

      <form
        onSubmit={handleProfileSubmit}
        className="my-page__profile-form card"
        style={{ marginTop: '1rem', padding: '1.25rem' }}
      >
        <h2 className="text-base font-bold text-gray-900 m-0 mb-4">프로필 작성 · 수정</h2>
        {profileLoading ? (
          <p className="text-sm text-gray-500 m-0">불러오는 중…</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputCls}
                placeholder="홍길동"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">출신 학교</label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => setForm((f) => ({ ...f, schoolName: e.target.value }))}
                className={inputCls}
                placeholder="서울대학교"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학년</label>
              <select
                value={form.grade ?? ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    grade: (e.target.value || null) as MenteeGrade | null,
                  }))
                }
                className={inputCls}
              >
                <option value="">선택</option>
                {GRADE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">목표 학교</label>
              <input
                type="text"
                value={form.targetSchool}
                onChange={(e) => setForm((f) => ({ ...f, targetSchool: e.target.value }))}
                className={inputCls}
                placeholder="서울대학교"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">목표일</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm((f) => ({ ...f, targetDate: e.target.value }))}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">프로필 이미지</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary-50)] file:text-[var(--color-primary-600)]"
              />
              {profileFile && (
                <p className="text-xs text-gray-500 mt-1 m-0">{profileFile.name}</p>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => navigate(myPagePath)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updateProfile.isPending || updateProfileImage.isPending}
                className="px-4 py-2 rounded-lg bg-[var(--color-primary-500)] text-white text-sm hover:bg-[var(--color-primary-600)] disabled:opacity-50"
              >
                {updateProfile.isPending || updateProfileImage.isPending
                  ? '저장 중…'
                  : '저장'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
