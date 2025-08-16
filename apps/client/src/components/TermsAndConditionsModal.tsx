import { useTranslation } from 'react-i18next';

interface TermsAndConditionsModalProps {
  setIsTermsModalOpen: (isTermsModalOpen: boolean) => void;
}

const TermsAndConditionsModal = ({
  setIsTermsModalOpen,
}: TermsAndConditionsModalProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 bg-gray-200 bg-opacity-10 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-hidden transition-all duration-300 ease-out transform my-auto"
        style={{ animation: 'modalSlideIn 0.3s ease-out' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {t('terms.title')}
          </h2>
          <button
            onClick={() => setIsTermsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-10rem)] sm:max-h-[calc(90vh-8rem)]">
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>{t('terms.routePlanning')}</p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                {t('terms.fuelPriceTitle')}
              </h3>
              <p className="text-blue-700">{t('terms.fuelPriceInfo')}</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-medium text-amber-800 mb-2">
                {t('terms.disclaimerTitle')}
              </h3>
              <ul className="text-amber-700 space-y-2">
                <li>• {t('terms.disclaimer1')}</li>
                <li>• {t('terms.disclaimer2')}</li>
                <li>• {t('terms.disclaimer3')}</li>
                <li>• {t('terms.disclaimer4')}</li>
              </ul>
            </div>

            <p className="text-xs text-gray-500">{t('terms.lastUpdated')}</p>
          </div>
        </div>
        <div className="p-6 pb-8 sm:pb-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsTermsModalOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {t('terms.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
