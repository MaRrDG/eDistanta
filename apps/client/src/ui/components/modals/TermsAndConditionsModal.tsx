import { useTranslation } from 'react-i18next';
import BaseModal from '@ui/components/common/BaseModal';

interface TermsAndConditionsModalProps {
  setIsTermsModalOpen: (isTermsModalOpen: boolean) => void;
}

const TermsAndConditionsModal = ({
  setIsTermsModalOpen,
}: TermsAndConditionsModalProps) => {
  const { t } = useTranslation();

  return (
    <BaseModal
      isOpen={true}
      onClose={() => setIsTermsModalOpen(false)}
      title={t('terms.title')}
      footer={
        <button
          onClick={() => setIsTermsModalOpen(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {t('terms.close')}
        </button>
      }
    >
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

        <p className="text-xs text-gray-700">{t('terms.lastUpdated')}</p>
      </div>
    </BaseModal>
  );
};

export default TermsAndConditionsModal;
