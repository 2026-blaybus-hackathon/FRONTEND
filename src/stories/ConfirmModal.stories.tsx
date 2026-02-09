import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import ConfirmModal from '../components/common/modal/ConfirmModal';
import Button from '../components/common/button/Button';
import '../App.css';

const meta = {
  title: 'Common/Modal/ConfirmModal',
  component: ConfirmModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

export const Default: Story = {
  args: {
    title: '새로운 할 일 추가',
    confirmLabel: '추가하기',
    cancelLabel: '취소',
    onConfirm: () => alert('확인 버튼 클릭'),
    onCancel: () => alert('취소 또는 닫기 클릭'),
    children: (
      <div className="pt-2 text-sm text-gray-700">
        여기에 모달 내용을 넣어 미리보기를 확인할 수 있어요.
      </div>
    ),
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
      alert('확인 버튼 클릭');
      setOpen(false);
    };

    const handleCancel = () => {
      alert('취소 또는 닫기 클릭');
      setOpen(false);
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <Button
          variant="primary"
          ariaLabel="모달 열기 버튼"
          onClick={() => setOpen(true)}
        >
          새로운 할 일 추가
        </Button>

        {open && (
          <ConfirmModal
            title="새로운 할 일 추가"
            confirmLabel="추가하기"
            cancelLabel="취소"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          >
            <div className="pt-2 text-sm text-gray-700">
              여기에 모달 내용을 넣어 미리보기를 확인할 수 있어요.
            </div>
          </ConfirmModal>
        )}
      </div>
    );
  },
};

