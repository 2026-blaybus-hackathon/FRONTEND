import React, { useState, useEffect } from 'react';
import Button from '../../common/button/Button';
import '../../../styles/components/task-detail-modal.css';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskDetail: TaskDetail) => void;
  task: Task | null;
}

interface Task {
  id: number;
  title: string;
  subject: string;
  date: string;
  studyHours?: number;
  studyMinutes?: number;
  description?: string;
  imageUrl?: string;
}

interface TaskDetail {
  id: number;
  studyHours: number;
  studyMinutes: number;
  description: string;
  imageUrl?: string;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
  const [studyHours, setStudyHours] = useState(1);
  const [studyMinutes, setStudyMinutes] = useState(0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const subjectColors: Record<string, string> = {
    '국어': '#EF4444',
    '수학': '#3B82F6',
    '영어': '#10B981',
  };

  useEffect(() => {
    if (task) {
      setStudyHours(task.studyHours || 1);
      setStudyMinutes(task.studyMinutes || 0);
      setDescription(task.description || '');
      setImageUrl(task.imageUrl || '');
    }
  }, [task]);

  const handleSubmit = () => {
    if (task) {
      onSubmit({
        id: task.id,
        studyHours,
        studyMinutes,
        description,
        imageUrl,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: 실제 이미지 업로드 로직
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen || !task) return null;

  const subjectColor = subjectColors[task.subject] || '#6B7280';

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content task-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>과제 상세 정보</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* 과제 정보 헤더 */}
          <div className="task-info-header">
            <span 
              className="task-subject-badge-large" 
              style={{ backgroundColor: `${subjectColor}20`, color: subjectColor }}
            >
              {task.subject}
            </span>
            <span className="task-date">{task.date}</span>
          </div>

          <h3 className="task-title-large">{task.title}</h3>

          {/* 공부 시간 */}
          <div className="form-group">
            <label className="form-label">
              공부 시간 <span className="required">*</span>
            </label>
            <div className="time-picker">
              <div className="time-input-group">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={studyHours}
                  onChange={(e) => setStudyHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                  className="time-input"
                />
                <div className="time-arrows">
                  <button 
                    className="time-arrow-btn"
                    onClick={() => setStudyHours(Math.min(23, studyHours + 1))}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 3l3 3H3l3-3z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button 
                    className="time-arrow-btn"
                    onClick={() => setStudyHours(Math.max(0, studyHours - 1))}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 9L3 6h6l-3 3z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <span className="time-unit">시간</span>
              </div>

              <div className="time-input-group">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={studyMinutes}
                  onChange={(e) => setStudyMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="time-input"
                />
                <div className="time-arrows">
                  <button 
                    className="time-arrow-btn"
                    onClick={() => setStudyMinutes(Math.min(59, studyMinutes + 1))}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 3l3 3H3l3-3z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button 
                    className="time-arrow-btn"
                    onClick={() => setStudyMinutes(Math.max(0, studyMinutes - 1))}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 9L3 6h6l-3 3z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <span className="time-unit">분</span>
              </div>
            </div>
          </div>

          {/* 과제 제출 */}
          <div className="form-group">
            <label className="form-label">과제 제출</label>
            <textarea
              className="form-textarea"
              placeholder="공부하면서 느낀 점이나 질문을 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* 이미지 업로드 */}
          <div className="form-group">
            <div className="image-upload-area">
              {imageUrl ? (
                <div className="uploaded-image">
                  <img src={imageUrl} alt="업로드된 이미지" />
                  <button 
                    className="remove-image-btn"
                    onClick={() => setImageUrl('')}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15 5L5 15M5 5l10 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="image-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-upload-input"
                  />
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="5" y="8" width="30" height="24" rx="2" stroke="#9CA3AF" strokeWidth="2"/>
                    <circle cx="13" cy="16" r="2" fill="#9CA3AF"/>
                    <path d="M5 26l8-8 4 4 8-8 10 10" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>사진 첨부 및 제출 완료하기</p>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button
            variant="secondary"
            onClick={handleClose}
            ariaLabel="임시저장"
            size="lg"
          >
            임시저장
          </Button>
          <Button
            onClick={handleSubmit}
            ariaLabel="제출하기"
            size="lg"
          >
            제출하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
