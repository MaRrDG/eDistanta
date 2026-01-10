import { useTranslation } from 'react-i18next';
import BaseModal from '../common/BaseModal';

interface TollBridge {
  id: string;
  name: string;
  nameRo: string;
  coordinates: [number, number];
  tollEUR: number;
  tollRON: number;
  description: string;
  descriptionRo: string;
  highway?: string;
  crossesBorder: boolean;
  vehicleRates?: {
    car: { ron: number; eur: number };
    minibus: { ron: number; eur: number };
    bus: { ron: number; eur: number };
  };
}

type VehicleType = 'car' | 'bus' | 'minibus';

interface TollInfoModalProps {
  setIsTollModalOpen: (isTollModalOpen: boolean) => void;
  bridges: TollBridge[];
  totalRON: number;
  totalEUR: number;
  vehicleType: VehicleType;
}

const TollInfoModal = ({ setIsTollModalOpen, bridges, totalRON, totalEUR, vehicleType }: TollInfoModalProps) => {
  const { t } = useTranslation();

  // Calculate individual bridge cost based on vehicle type
  const getBridgeCost = (bridge: TollBridge, currency: 'RON' | 'EUR' = 'RON') => {
    // Check if bridge has vehicle-specific rates
    if (bridge.vehicleRates) {
      const vehicleRate = bridge.vehicleRates[vehicleType];
      return currency === 'EUR' ? vehicleRate.eur : vehicleRate.ron;
    } else {
      // For bridges without vehicle-specific rates, use base toll (car rate only)
      const baseToll = currency === 'EUR' ? bridge.tollEUR : bridge.tollRON;
      return baseToll;
    }
  };

  return (
    <BaseModal
      isOpen={true}
      onClose={() => setIsTollModalOpen(false)}
      title={t('tollModal.title')}
      footer={
        <button
          onClick={() => setIsTollModalOpen(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {t('common.close')}
        </button>
      }
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
        {/* Total Cost Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-medium">
              {t('tollModal.totalCost')} ({t(`vehicleTypes.${vehicleType}`)}):
            </span>
            <span className="text-lg font-semibold text-blue-900">
              {totalRON} RON
              {totalEUR > 0 && (
                <span className="text-sm text-blue-600 ml-1">
                  (~{totalEUR} EUR)
                </span>
              )}
            </span>
          </div>
          <div className="mt-2 text-sm text-blue-600">
            {bridges.length} {bridges.length === 1 ? t('tollModal.bridge') : t('tollModal.bridges')}
          </div>
        </div>

        {/* Bridge Details */}
        <div>
          <h3 className="font-medium text-gray-800 mb-3">
            {t('tollModal.bridgeDetails')}:
          </h3>
          <div className="space-y-3">
            {bridges.map((bridge) => (
              <div key={bridge.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {bridge.nameRo}
                    </h4>
                    <p className="text-xs text-gray-800 mt-1">
                      {bridge.descriptionRo}
                    </p>
                    {bridge.highway && (
                      <p className="text-xs text-blue-600 mt-1">
                        {bridge.highway}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-3">
                    <span className="text-sm font-semibold text-gray-900">
                      {getBridgeCost(bridge, 'RON')} RON
                    </span>
                    {getBridgeCost(bridge, 'EUR') > 0 && (
                      <p className="text-xs text-gray-700">
                        (~{getBridgeCost(bridge, 'EUR')} EUR)
                      </p>
                    )}
                    <p className="text-xs text-gray-700">
                      {t('tollModal.perPass')}
                    </p>
                    {bridge.crossesBorder && (
                      <p className="text-xs text-orange-600">
                        {t('routeDetails.internationalBridge')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial Section */}
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3 mt-0.5">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0-4.344a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.102m-4.344 0" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-800 mb-2">
                {t('tollModal.commercialTitle')}
              </h3>
              <p className="text-amber-700 mb-3">
                {t('tollModal.commercialMessage')}
              </p>
              <a
                href="mailto:contact@edistanta.ro?subject=Partnership Opportunity - Toll Services"
                className="inline-flex items-center px-3 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('tollModal.contactButton')}
              </a>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-700">{t('tollModal.disclaimer')}</p>
      </div>
    </BaseModal>
  );
};

export default TollInfoModal;
