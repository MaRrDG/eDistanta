import { useTranslation } from 'react-i18next';
import BaseModal from '@ui/components/common/BaseModal';

interface ProjectInfoModalProps {
  setIsInfoModalOpen: (isInfoModalOpen: boolean) => void;
}

const ProjectInfoModal = ({ setIsInfoModalOpen }: ProjectInfoModalProps) => {
  const { t } = useTranslation();

  return (
    <BaseModal
      isOpen={true}
      onClose={() => setIsInfoModalOpen(false)}
      title={t('info.title')}
      footer={
        <button
          onClick={() => setIsInfoModalOpen(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {t('info.close')}
        </button>
      }
      maxWidth="max-w-lg"
    >
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

        <div className="text-sm text-gray-800">
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
    </BaseModal>
  );
};

export default ProjectInfoModal;
