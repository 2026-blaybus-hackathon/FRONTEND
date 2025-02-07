# 코드 개선 TODO 리스트

## 🔴 높은 우선순위

### 접근성 개선
- [ ] 모든 버튼에 aria-label 추가
  - [ ] 모달 닫기 버튼
  - [ ] 햄버거 메뉴 버튼
  - [ ] 과제 편집/삭제 버튼
  - [ ] 시간 증가/감소 버튼
  - [ ] 이미지 제거 버튼
  - [ ] 알림 화살표 버튼
  - [ ] 플로팅 추가 버튼

### NavLink 사용
- [ ] Sidebar의 모든 `<a>` 태그를 `<NavLink>`로 변경
  - [ ] active 상태 자동 관리
  - [ ] 클라이언트 측 라우팅

## 🟡 중간 우선순위

### 디자인 토큰 활용
- [ ] 하드코딩된 색상을 CSS 변수로 변경
  - [ ] Sidebar 배경색 (#1F2937 → var(--color-gray-800))
  - [ ] 로고 색상 (#818CF8 → var(--color-primary-500))
  - [ ] 버튼 색상 (#6366F1 → var(--color-primary-500))
  - [ ] 알림 배너 그라데이션
  - [ ] 과목별 색상 (SUBJECT_COLORS)

### 상수 분리
- [x] SUBJECTS, FILTERS 상수 파일로 분리 (완료)
- [ ] AddTaskModal, EditTaskModal, DashboardPage에서 constants.ts 사용
- [ ] TaskCard, TaskDetailModal에서 SUBJECT_COLORS 사용

### 이미지 업로드
- [ ] 실제 이미지 업로드 API 연동
- [ ] 파일 크기 제한
- [ ] 이미지 압축

### ID 생성
- [ ] Date.now() 대신 uuid 라이브러리 사용
- [ ] 또는 서버에서 ID 할당

## 🟢 낮은 우선순위 (추후 리팩토링)

### Icon 컴포넌트 분리
- [ ] 재사용 가능한 Icon 컴포넌트 생성
- [ ] 모든 SVG 아이콘을 Icon 컴포넌트로 교체
- [ ] 아이콘 라이브러리 고려 (lucide-react, heroicons 등)

### DatePicker
- [ ] 커스텀 DatePicker 라이브러리 사용 고려
- [ ] 브라우저 간 일관된 UI

### CSS 개선
- [ ] !important 사용 제거
- [ ] CSS 선택자 특이성 개선

### 기타
- [ ] Layout 컴포넌트 역할 재검토
- [ ] 피드백 API 연동
- [ ] 사용자 정보 API 연동

## ✅ 완료

- [x] 하드코딩된 데이터 동적 처리
  - [x] weekDays 배열 동적 생성
  - [x] 헤더 날짜 동적 표시
  - [x] TODAY'S FOCUS 계산
  - [x] WEEKLY SCORE 계산
  - [x] 과제 개수 동적 표시
- [x] Sidebar 사용자 정보 동적 처리
- [x] authStore User 타입 추가
- [x] PlaceholderPage 인라인 스타일 제거
- [x] 상수 파일 생성 (constants.ts)
