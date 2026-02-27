import { useTranslation } from 'react-i18next';

import type { TollSummary } from '@core/entities/toll';

interface TollInfoProps {
  tollSummary: TollSummary;
}

const TollInfo = ({ tollSummary }: TollInfoProps) => {
  const { t } = useTranslation();

  if (!tollSummary.hasTolls) {
    return null;
  }

  return (
    <div className="mb-4 px-4 md:px-0">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <div className="flex items-start">
          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-2 mt-0.5">
            <svg
              className="w-4 h-4 text-orange-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-orange-800 text-sm font-medium mb-2">
              {t('routeDetails.tollBridgesDetected')}
            </p>
            <div className="space-y-1">
              {tollSummary.bridges.map((bridge) => (
                <div key={bridge.id} className="text-xs text-orange-700">
                  <span className="font-medium">{bridge.nameRo}</span>
                  <span className="text-orange-600 ml-2">
                    {bridge.tollRON > 0 ? `${bridge.tollRON} RON` : `${bridge.tollEUR} EUR`}
                  </span>
                  {bridge.crossesBorder && (
                    <span className="text-orange-500 ml-1">
                      ({t('routeDetails.internationalBridge')})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TollInfo;
