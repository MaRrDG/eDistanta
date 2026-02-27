import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RouteSearchRecord } from '@core/entities/history';
import { getRelativeTime } from '@utils/timeUtils';
import { useUserRouteHistory } from '@ui/hooks/useRouteHistory';
import BaseModal from '@ui/components/common/BaseModal';

interface RecentSearchesSectionProps {
    onHistorySelect: (historyRecord: RouteSearchRecord) => void;
}

export const RecentSearchesSection = ({ onHistorySelect }: RecentSearchesSectionProps) => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const { data: historyData, isLoading } = useUserRouteHistory(page);
    const [isOpen, setIsOpen] = useState(false);

    if (!historyData || (historyData.data.length === 0 && page === 1)) {
        return null;
    }

    const { data: records, totalPages, currentPage, total } = historyData;

    return (
        <div className="mb-4">
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="cursor-pointer w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-slate-800">
                            {t('history.viewHistory', 'Vezi Istoric Căutări')}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {total} {t('history.recentRoutes', 'rute recente')}
                        </p>
                    </div>
                </div>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <BaseModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={
                    <div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900 block">
                            {t('history.recentSearches', 'Căutări Recente')}
                        </span>
                        <span className="text-sm font-normal text-slate-500 mt-1 block">
                            {t('history.subtitle', 'Ultimele rute planificate de tine')}
                        </span>
                    </div>
                }
                maxWidth="max-w-2xl"
                className="!p-0 border border-slate-200/50"
                footer={
                    totalPages > 1 ? (
                        <div className="flex items-center justify-between w-full">
                            <span className="text-xs text-slate-400 hidden sm:block">
                                {t('history.clickOutside', 'Apasă oriunde afară pentru a ieși')}
                            </span>
                            <div className="flex items-center gap-4 ml-auto">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setPage(p => Math.max(1, p - 1)); }}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="hidden sm:inline">{t('common.previous', 'Înapoi')}</span>
                                </button>

                                <div className="text-sm text-slate-500 font-medium">
                                    {currentPage} / {totalPages}
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); setPage(p => Math.min(totalPages, p + 1)); }}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${currentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
                                >
                                    <span className="hidden sm:inline">{t('common.next', 'Înainte')}</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : undefined
                }
            >
                <div className={`p-4 sm:p-6 custom-scrollbar space-y-4 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {records.map((record: RouteSearchRecord) => (
                        <button
                            key={record.id}
                            onClick={() => {
                                setIsOpen(false);
                                onHistorySelect(record);
                            }}
                            className="block w-full text-left history-card group relative bg-slate-50 hover:bg-white p-4 sm:p-5 rounded-lg border border-transparent hover:border-blue-600/20 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 cursor-pointer"
                        >
                            {/* DESKTOP LAYOUT */}
                            <div className="hidden sm:flex flex-row items-start justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center pt-1">
                                        {/* Car Icon */}
                                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-4.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z" />
                                        </svg>
                                        <div className="w-px h-full bg-slate-200 my-2 min-h-[24px]"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                {t('history.departure', 'Plecare')}
                                            </span>
                                            <p className="text-lg font-bold text-slate-900 truncate">{record.startName}</p>
                                        </div>
                                        <div className="flex items-center gap-2 py-2">
                                            <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                            <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                                                {record.distanceKm && `${record.distanceKm} km`}
                                                {record.distanceKm && record.estimatedTimeMins && ' • '}
                                                {record.estimatedTimeMins && `${Math.floor(record.estimatedTimeMins / 60)}h ${record.estimatedTimeMins % 60}min`}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                {t('history.destination', 'Destinație')}
                                            </span>
                                            <p className="text-lg font-bold text-slate-900 truncate max-w-full">{record.endName}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                                    <div className="flex items-center gap-2 mb-auto">
                                        {(record.waypoints && record.waypoints.length > 0) && (
                                            <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md text-xs font-bold border border-orange-100 whitespace-nowrap">
                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                                                {record.waypoints.length} {t('history.stops', 'opriri')}
                                            </span>
                                        )}
                                        {record.isRoundTrip && (
                                            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-100 whitespace-nowrap">
                                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                </svg>
                                                {t('history.roundTrip', 'Dus-întors')}
                                            </span>
                                        )}
                                        <span className="text-xs font-medium text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm">
                                            {getRelativeTime(record.updatedAt, t)}
                                        </span>
                                    </div>

                                    <div className="replan-btn bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-blue-600/25 hover:bg-blue-700 flex items-center justify-center gap-2 transition-transform active:scale-95">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l6-3 5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.447.894L15 17zM9 20l6-3M9 20V7m6 13V4" />
                                        </svg>
                                        {t('history.replan', 'Replanifică')}
                                    </div>
                                </div>
                            </div>

                            {/* MOBILE LAYOUT */}
                            <div className="flex sm:hidden flex-col">
                                <div className="flex gap-3">
                                    <div className="pt-0.5">
                                        <svg className="w-5 h-5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-4.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <div className="text-[15px] font-bold text-slate-900 line-clamp-2 leading-snug">
                                            {record.startName} <span className="text-blue-500 font-semibold mx-1">→</span> {record.endName}
                                        </div>
                                        <div className="text-sm font-medium text-slate-500 mt-1">
                                            {record.distanceKm && `${record.distanceKm} km`}
                                            {record.distanceKm && record.estimatedTimeMins && ' • '}
                                            {record.estimatedTimeMins && `${Math.floor(record.estimatedTimeMins / 60)}h ${record.estimatedTimeMins % 60}min`}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100/80">
                                    <div className="flex items-center gap-2">
                                        {(record.waypoints && record.waypoints.length > 0) && (
                                            <span className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[11px] font-bold border border-orange-100 whitespace-nowrap">
                                                {record.waypoints.length} {t('history.stops', 'opriri')}
                                            </span>
                                        )}
                                        {record.isRoundTrip && (
                                            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-100 whitespace-nowrap">
                                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                </svg>
                                                {t('history.roundTrip', 'Dus-întors')}
                                            </span>
                                        )}
                                        {(!record.waypoints?.length && !record.isRoundTrip) && (
                                            <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                {t('history.directRoute', 'Traseu direct')}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-1 rounded-full whitespace-nowrap shadow-sm">
                                        {getRelativeTime(record.updatedAt, t)}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </BaseModal>
        </div>
    );
};
