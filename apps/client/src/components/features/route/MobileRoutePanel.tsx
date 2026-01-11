import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Sheet, type SheetRef } from 'react-modal-sheet';
import RouteDetails from './RouteDetails';
import type { RouteData, Waypoint } from '../../../types/route';

interface MobileRoutePanelProps {
  routes: RouteData[];
  selectedRouteIndex: number;
  onRouteSelected: (index: number) => void;
  waypoints: Waypoint[];
  startLocation?: [number, number] | null;
  endLocation?: [number, number] | null;
  startName?: string;
  endName?: string;
  isDetailsExpanded: boolean;
  setIsDetailsExpanded: (expanded: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
  safeAreaBottom: number;
  distance: number | null;
  duration: number | null;
  onTollModalOpen?: (tollSummary: {
    bridges: any[];
    totalRON: number;
    totalEUR: number;
    vehicleType: 'car' | 'bus' | 'minibus';
  }) => void;
}

const MobileRoutePanel = ({
  routes,
  selectedRouteIndex,
  onRouteSelected,
  waypoints,
  startLocation,
  endLocation,
  startName,
  endName,
  setIsDetailsExpanded,
  setIsSidebarOpen,
  safeAreaBottom,
  distance,
  duration,
  onTollModalOpen
}: MobileRoutePanelProps) => {
  const { t } = useTranslation();

  // Internal state
  const [sheetRef, setSheetRef] = useState<SheetRef | null>(null);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(1);
  const [internalExpanded, setInternalExpanded] = useState(false);

  // Only show sheet when routes are available
  const isOpen = routes && routes.length > 0;

  const snapPoints = [0, 70, 1];
  const initialSnap = 1; // Start at 70px
  const lastSnap = snapPoints.length - 1;

  const handleSnapChange = (snapIndex: number) => {
    setCurrentSnapIndex(snapIndex);
    setInternalExpanded(snapIndex === lastSnap);
    setIsDetailsExpanded(snapIndex >= 2);

    if (snapIndex >= 2) {
      setIsSidebarOpen(false);
    }
  };

  const handleClose = () => {
    // Prevent fully closing - snap back to initial
    setInternalExpanded(false);
    setIsDetailsExpanded(false);
  };

  const handleSheetRef = (ref: SheetRef | null) => {
    if (!sheetRef && ref) {
      setSheetRef(ref);
    }
  };

  const toggleExpanded = () => {
    if (!sheetRef) return;

    // Cycle through snap points: 1 (collapsed) -> 2 (fully expanded) -> 1
    if (currentSnapIndex === 1) {
      sheetRef.snapTo(lastSnap); // Go to fully expanded
    } else {
      sheetRef.snapTo(1); // Go back to collapsed
    }
  };

  return (
    <>
      <Sheet
        ref={handleSheetRef}
        isOpen={isOpen}
        onClose={handleClose}
        snapPoints={snapPoints}
        initialSnap={initialSnap}
        onSnap={handleSnapChange}
        disableDismiss
        tweenConfig={{
          ease: 'easeOut',
          duration: 0.4, // 400ms - slower than default (250ms)
        }}
        className="md:hidden"
        style={{
          zIndex: 40,
        }}
      >
        <Sheet.Container
          style={{
            paddingBottom: `max(${safeAreaBottom}px, env(safe-area-inset-bottom, 0px))`,
          }}
        >
          <Sheet.Header>
            {/* Drag indicator */}
            <div className="w-10 h-1 bg-gray-400 rounded-full mx-auto my-2" />

            {/* Header content - clickable to toggle */}
            <div
              className="flex justify-between items-center px-4 py-3 border-b border-blue-100 cursor-pointer w-full text-left"
              onClick={toggleExpanded}
              role="button"
              tabIndex={0}
              aria-label={internalExpanded ? "Collapse route details" : "Expand route details"}
              aria-expanded={internalExpanded}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleExpanded();
                }
              }}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5 text-blue-700"
                    aria-hidden="true"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">
                  {t('routeDetails.title')}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-blue-700 mr-1"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">
                    {duration && Math.floor(duration / 60)}
                    {t('units.hour')} {duration && Math.round(duration % 60)}
                    {t('units.min')}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-blue-700 mr-1"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">
                    {distance && distance.toFixed(1)} {t('units.km')}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-5 h-5 text-blue-700 transform transition-transform ${internalExpanded ? 'rotate-180' : ''
                    }`}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </Sheet.Header>
          <Sheet.Content>
            <div className="pb-4">
              <RouteDetails
                routes={routes}
                selectedRouteIndex={selectedRouteIndex}
                onRouteSelected={onRouteSelected}
                waypoints={waypoints}
                startLocation={startLocation}
                endLocation={endLocation}
                startName={startName}
                endName={endName}
                onTollModalOpen={onTollModalOpen}
              />
            </div>
          </Sheet.Content>
        </Sheet.Container>

        {/* Backdrop only shown at last snap point (fully expanded) */}
        {internalExpanded && <Sheet.Backdrop onTap={() => setInternalExpanded(false)} />}
      </Sheet>
    </>
  );
};

export default MobileRoutePanel;
