import React from 'react';
import Button from '../../common/button/Button';

interface ConfirmModalProps {
    title: string;
    children?: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}

const ConfirmModal = ({
    title,
    children,
    onConfirm,
    onCancel,
    confirmLabel = '확인',
    cancelLabel = '취소',
}: ConfirmModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="flex flex-col w-full p-6 max-w-[349px] gap-4 opacity-100 bg-white rounded-2xl overflow-hidden">
                <header className="flex items-center justify-between">
                    <h2 className="m-0 text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        type="button"
                        className="border-none bg-transparent cursor-pointer text-gray-400 hover:text-gray-600 p-1 text-xl leading-none"
                        onClick={onCancel}
                        aria-label="모달 닫기 버튼"
                    >
                        ×
                    </button>
                </header>

                <div className="h-[1px] bg-gray-50"></div>

                <div className="px-6 py-4">
                    {children}
                </div>

                <div className="h-[1px] bg-gray-50"></div>

                <footer className="flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={onCancel}
                        ariaLabel="취소 버튼"
                        className="min-w-[96px]"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={onConfirm}
                        ariaLabel="확인 버튼"
                        className="min-w-[96px]"
                    >
                        {confirmLabel}
                    </Button>
                </footer>
            </div>
        </div>
    );
};

export default ConfirmModal;