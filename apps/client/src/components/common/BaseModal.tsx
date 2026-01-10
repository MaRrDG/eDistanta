import React, { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: string;
    className?: string;
}

const BaseModal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    maxWidth = 'max-w-2xl',
    className = '',
}: BaseModalProps) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 bg-gray-200 bg-opacity-10 flex items-center justify-center z-[9999] p-4 transition-all duration-300 ease-out"
            style={{ animation: 'fadeIn 0.3s ease-out' }}
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className={`bg-white rounded-lg shadow-xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 ease-out transform my-auto ${maxWidth} ${className}`}
                style={{ animation: 'modalSlideIn 0.3s ease-out' }}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
                    <div className="text-xl font-semibold text-gray-800">
                        {title}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                        aria-label={t('common.close')}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {children}
                </div>

                {footer && (
                    <div className="p-6 pb-8 sm:pb-6 border-t border-gray-200 flex justify-end shrink-0">
                        {footer}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>,
        document.body
    );
};

export default BaseModal;
