const TeacherIllustration = () => {
  return (
    <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
      {/* 선생님 일러스트 */}
      <circle cx="100" cy="50" r="25" fill="#DBEAFE"/>
      <rect x="80" y="75" width="40" height="50" rx="5" fill="#3B82F6"/>
      <rect x="70" y="85" width="20" height="35" rx="3" fill="#2563EB"/>
      <rect x="110" y="85" width="20" height="35" rx="3" fill="#2563EB"/>
      <path d="M85 50 Q100 60 115 50" stroke="#1E3A8A" strokeWidth="2" fill="none"/>
      <circle cx="90" cy="45" r="3" fill="#1E3A8A"/>
      <circle cx="110" cy="45" r="3" fill="#1E3A8A"/>
      <rect x="85" y="125" width="12" height="25" rx="2" fill="#1D4ED8"/>
      <rect x="103" y="125" width="12" height="25" rx="2" fill="#1D4ED8"/>
      {/* 안경 */}
      <circle cx="90" cy="45" r="6" stroke="#1E3A8A" strokeWidth="1.5" fill="none"/>
      <circle cx="110" cy="45" r="6" stroke="#1E3A8A" strokeWidth="1.5" fill="none"/>
      <line x1="96" y1="45" x2="104" y2="45" stroke="#1E3A8A" strokeWidth="1.5"/>
    </svg>
  );
};

export default TeacherIllustration;
