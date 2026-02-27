import { useTranslation } from 'react-i18next';
import BaseModal from './BaseModal';
import BaseButton from '../base/BaseButton';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isLoading = false,
  variant = 'danger',
}: ConfirmationModalProps) => {
  const { t } = useTranslation();

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: (
            <div className="p-3 bg-error/10 rounded-xl">
              <svg
                className="w-6 h-6 text-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          ),
          btnVariant: 'danger' as const,
        };
      case 'warning':
        return {
          icon: (
            <div className="p-3 bg-amber-100 rounded-xl">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          ),
          btnVariant: 'warning' as const,
        };
      default: // info
        return {
          icon: (
            <div className="p-3 bg-brand-primary/10 rounded-xl">
              <svg
                className="w-6 h-6 text-brand-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          ),
          btnVariant: 'primary' as const,
        };
    }
  };

  const { icon, btnVariant } = getVariantStyles();

  const footer = (
    <div className="flex gap-3 justify-end w-full">
      <BaseButton
        variant="secondary"
        onClick={onClose}
        disabled={isLoading}
        className="flex-1 sm:flex-none"
      >
        {cancelText || t('common.cancel')}
      </BaseButton>
      <BaseButton
        variant={btnVariant}
        onClick={onConfirm}
        isLoading={isLoading}
        className="flex-1 sm:flex-none"
      >
        {confirmText || (variant === 'danger' ? t('common.delete') : t('common.confirm'))}
      </BaseButton>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={footer}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <p className="text-neutral-600 leading-relaxed">{message}</p>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmationModal;
