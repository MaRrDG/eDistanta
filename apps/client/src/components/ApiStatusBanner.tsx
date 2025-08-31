import { useTranslation } from 'react-i18next';

interface ApiStatusBannerProps {
  isApiHealthy: boolean | undefined;
}

const ApiStatusBanner = ({ isApiHealthy }: ApiStatusBannerProps) => {
  const { t } = useTranslation();

  if (isApiHealthy !== false) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white px-4 py-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="font-medium">
            {t('routeDetails.apiError.title')}: {t('routeDetails.apiError.description')}
          </span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium ml-4 transition-colors"
          aria-label={t('routeDetails.apiError.retry')}
        >
          {t('routeDetails.apiError.retry')}
        </button>
      </div>
    </div>
  );
};

export default ApiStatusBanner;
