import { useState } from 'react';
import Button from '../../common/button/Button';
import type { taskTypes } from '../../../types';
import { SUBJECTS } from '../../../static/subjects';
import '../../../styles/components/modal.css';

type TaskData = taskTypes.TaskData;

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskData) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');

  const subjects = SUBJECTS;

  const handleSubmit = () => {
    if (title && subject && date) {
      onSubmit({ title, subject, date });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setSubject('');
    setDate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>새로운 할 일 추가</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* 학습 내용 */}
          <div className="form-group">
            <label className="form-label">학습 내용</label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 수능특강 영어 3강 문제풀이"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 과목 */}
          <div className="form-group">
            <label className="form-label">과목</label>
            <div className="subject-buttons">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  className={`subject-btn ${subject === subj ? 'active' : ''}`}
                  onClick={() => setSubject(subj)}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* 날짜 */}
          <div className="form-group">
            <label className="form-label">날짜</label>
            <div className="date-input-wrapper">
              <input
                type="date"
                className="form-input date-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <svg className="calendar-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="4" width="14" height="13" rx="1" stroke="#9CA3AF" strokeWidth="1.5"/>
                <line x1="3" y1="8" x2="17" y2="8" stroke="#9CA3AF" strokeWidth="1.5"/>
                <line x1="7" y1="2" x2="7" y2="6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="13" y1="2" x2="13" y2="6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button
            variant="secondary"
            onClick={handleClose}
            ariaLabel="취소"
            size="lg"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title || !subject || !date}
            ariaLabel="추가하기"
            size="lg"
          >
            추가하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
