import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenteeList } from '../../hooks/useMenteeList';
import SearchInput from '../../components/common/input/SearchInput';
import { getProfileImageUrl } from '../../libs/utils';
import '../../styles/pages/mentee-list.css';

const MenteeListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('전체');
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'progress'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 멘티 목록 조회 (검색, 필터, 정렬 포함)
  const { menteeList, totalCount, isLoading, isError } = useMenteeList({
    searchQuery: searchQuery.trim(),
    subject: selectedSubject,
    sortBy,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMenteeClick = (menteeId: number) => {
    // 멘티 상세 페이지로 이동 (향후 구현)
    navigate(`/mentor/mentees/${menteeId}`);
  };

  const subjects = ['전체', '국어', '수학', '영어', '과학', '사회'];

  return (
    <div className="mentee-list-container">
      {/* 헤더 */}
      <div className="mentee-list-header">
        <div>
          <h1 className="page-title">멘티 관리</h1>
          <p className="page-subtitle">
            총 {totalCount}명의 멘티를 관리하고 있습니다.
          </p>
        </div>
        <button className="add-mentee-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          멘티 추가
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="mentee-list-controls">
        <div className="search-section">
          <SearchInput
            value={searchQuery}
            onChange={handleSearch}
            placeholder="멘티 이름으로 검색..."
          />
        </div>

        <div className="filter-section">
          {/* 과목 필터 */}
          <div className="filter-group">
            <label className="filter-label">과목</label>
            <div className="filter-buttons">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  className={`filter-btn ${selectedSubject === subject ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* 정렬 */}
          <div className="sort-group">
            <label className="filter-label">정렬</label>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="name">이름순</option>
              <option value="recent">최근 활동순</option>
              <option value="progress">진행률순</option>
            </select>
          </div>

          {/* 뷰 모드 */}
          <div className="view-mode-group">
            <button
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="그리드 뷰"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="리스트 뷰"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 멘티 목록 */}
      <div className="mentee-list-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner">
              <svg className="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="loading-text">멘티 목록을 불러오는 중...</p>
          </div>
        ) : isError ? (
          <div className="error-state">
            <svg className="error-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="30" stroke="#EF4444" strokeWidth="3"/>
              <path d="M40 25v20M40 55v5" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <p className="error-title">멘티 목록을 불러오는데 실패했습니다.</p>
            <p className="error-subtitle">잠시 후 다시 시도해주세요.</p>
          </div>
        ) : menteeList.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="30" r="12" stroke="#D1D5DB" strokeWidth="3"/>
              <path d="M20 65c0-11 9-20 20-20s20 9 20 20" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <p className="empty-title">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 멘티가 없습니다.'}
            </p>
            <p className="empty-subtitle">
              {searchQuery ? '다른 검색어로 시도해보세요.' : '새로운 멘티를 추가해보세요.'}
            </p>
          </div>
        ) : (
          <div className={`mentee-${viewMode}`}>
            {menteeList.map((mentee) => (
              <div
                key={mentee.id}
                className="mentee-item"
                onClick={() => handleMenteeClick(mentee.id)}
              >
                <div className="mentee-avatar-section">
                  <div 
                    className="mentee-avatar-large"
                    style={{ backgroundColor: '#7C3AED' }}
                  >
                    {getProfileImageUrl(mentee.profileUrl) ? (
                      <img src={getProfileImageUrl(mentee.profileUrl)} alt="" className="w-full h-full object-cover rounded-inherit" referrerPolicy="no-referrer" />
                    ) : (
                      mentee.avatar
                    )}
                  </div>
                  <div className="mentee-status online" title="온라인" />
                </div>

                <div className="mentee-info-section">
                  <h3 className="mentee-name-large">{mentee.name}</h3>
                  <p className="mentee-subject-large">{mentee.subject}</p>
                  
                  {viewMode === 'list' && (
                    <div className="mentee-stats">
                      <div className="stat-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 12l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>진행률 85%</span>
                      </div>
                      <div className="stat-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>주 15시간</span>
                      </div>
                      <div className="stat-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="3" y="4" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                          <line x1="6" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.5"/>
                          <line x1="6" y1="10" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        <span>과제 3개</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mentee-actions-section">
                  <button 
                    className="action-btn-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/mentor/feedback?menteeId=${mentee.id}`);
                    }}
                  >
                    피드백
                  </button>
                  <button 
                    className="action-btn-small primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/mentor/assignment?menteeId=${mentee.id}`);
                    }}
                  >
                    과제 할당
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenteeListPage;
