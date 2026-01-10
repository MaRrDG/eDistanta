import React from 'react';
import { useTranslation } from 'react-i18next';
import FuelPriceHistoryChart from '../features/vehicle/FuelPriceHistoryChart';
import BaseModal from '../common/BaseModal';

interface PriceHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    stationName: string;
    fuelType: string;
}

const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({
    isOpen,
    onClose,
    stationName,
    fuelType,
}) => {
    const { t } = useTranslation();

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div>
                    <div>{t('routeDetails.historyTitle', 'Price History - Last 30 Days')}</div>
                    <div className="text-sm text-gray-500 font-normal mt-1">
                        {stationName} • {t(`fuelTypes.${fuelType}`)}
                    </div>
                </div>
            }
            footer={
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 cursor-pointer"
                >
                    {t('common.close', 'Close')}
                </button>
            }
            maxWidth="max-w-3xl"
        >
            <FuelPriceHistoryChart
                stationName={stationName}
                fuelType={fuelType}
                days={30}
            />

            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('terms.fuelPriceInfo')}</span>
                </div>
            </div>
        </BaseModal>
    );
};

export default PriceHistoryModal;
