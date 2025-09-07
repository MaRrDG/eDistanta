import type { ReactNode } from 'react';

type AlertType = 'warning' | 'error' | 'info' | 'success';

interface AlertBannerProps {
  type: AlertType;
  message: string | ReactNode;
  className?: string;
  icon?: ReactNode;
  onClose?: () => void;
}

const alertStyles: Record<AlertType, {
  container: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
}> = {
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-800',
  },
  error: {
    container: 'bg-red-50 border-red-200',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-800',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-800',
  },
  success: {
    container: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-800',
  },
};

const defaultIcons: Record<AlertType, ReactNode> = {
  warning: (
    <svg
      className="w-4 h-4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  error: (
    <svg
      className="w-4 h-4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg
      className="w-4 h-4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg
      className="w-4 h-4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
};

const AlertBanner = ({ 
  type, 
  message, 
  className = '', 
  icon, 
  onClose 
}: AlertBannerProps) => {
  const styles = alertStyles[type];
  const displayIcon = icon || defaultIcons[type];

  return (
    <div className={`mb-4 px-4 md:px-0 ${className}`}>
      <div className={`border rounded-lg p-3 ${styles.container}`}>
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${styles.iconBg}`}>
            <div className={styles.iconColor}>
              {displayIcon}
            </div>
          </div>
          <div className={`text-sm flex-1 ${styles.textColor}`}>
            {typeof message === 'string' ? <p>{message}</p> : message}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={`ml-2 p-1 rounded-md hover:bg-opacity-20 hover:bg-gray-500 transition-colors ${styles.iconColor}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
