import React from 'react';
import '../../../styles/components/task-card.css';

interface TaskCardProps {
  id: number;
  title: string;
  subject: string;
  status?: 'pending' | 'completed';
  dueTime?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onDetail?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  subject,
  status = 'pending',
  dueTime,
  onEdit,
  onDelete,
  onDetail,
}) => {
  const subjectColors: Record<string, string> = {
    '국어': '#EF4444',
    '수학': '#3B82F6',
    '영어': '#10B981',
  };

  const subjectColor = subjectColors[subject] || '#6B7280';

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span 
          className="task-subject-badge" 
          style={{ backgroundColor: `${subjectColor}20`, color: subjectColor }}
        >
          {subject}
        </span>
        <div className="task-actions">
          <button className="task-action-btn" onClick={onEdit}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="task-action-btn" onClick={onDelete}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <h3 className="task-title">{title}</h3>

      {dueTime && (
        <div className="task-due-time">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>{dueTime}</span>
        </div>
      )}

      {status === 'completed' && (
        <div className="task-status-badge completed">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11.667 3.5L5.25 9.917 2.333 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>제출 완료</span>
        </div>
      )}

      <button className="task-detail-btn" onClick={onDetail}>
        상세 보기 &gt;
      </button>
    </div>
  );
};

export default TaskCard;
