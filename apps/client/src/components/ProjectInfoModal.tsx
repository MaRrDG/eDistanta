import { useTranslation } from 'react-i18next';

interface ProjectInfoModalProps {
  setIsInfoModalOpen: (isInfoModalOpen: boolean) => void;
}

const ProjectInfoModal = ({ setIsInfoModalOpen }: ProjectInfoModalProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 bg-gray-200 bg-opacity-10 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] sm:max-h-[90vh] overflow-hidden transition-all duration-300 ease-out transform my-auto"
        style={{ animation: 'modalSlideIn 0.3s ease-out' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {t('info.title')}
          </h2>
          <button
            onClick={() => setIsInfoModalOpen(false)}
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
        <div className="p-6">
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">
                    {t('info.subtitle')}
                  </h3>
                  <p className="text-blue-700 text-sm">
                    {t('info.description')}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <h4 className="font-medium text-gray-800 mb-2">
                {t('info.featuresTitle')}
              </h4>
              <ul className="space-y-1">
                <li>• {t('info.feature1')}</li>
                <li>• {t('info.feature2')}</li>
                <li>• {t('info.feature3')}</li>
                <li>• {t('info.feature4')}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-6 pb-8 sm:pb-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsInfoModalOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {t('info.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoModal;
