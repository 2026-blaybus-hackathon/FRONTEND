const StudentIllustration = () => {
  return (
    <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
      {/* 학생 일러스트 */}
      <circle cx="100" cy="50" r="25" fill="#FEF3C7"/>
      <rect x="80" y="75" width="40" height="50" rx="5" fill="#FBBF24"/>
      <rect x="70" y="85" width="20" height="35" rx="3" fill="#F59E0B"/>
      <rect x="110" y="85" width="20" height="35" rx="3" fill="#F59E0B"/>
      <path d="M85 50 Q100 60 115 50" stroke="#92400E" strokeWidth="2" fill="none"/>
      <circle cx="90" cy="45" r="3" fill="#92400E"/>
      <circle cx="110" cy="45" r="3" fill="#92400E"/>
      <rect x="85" y="125" width="12" height="25" rx="2" fill="#D97706"/>
      <rect x="103" y="125" width="12" height="25" rx="2" fill="#D97706"/>
    </svg>
  );
};

export default StudentIllustration;
