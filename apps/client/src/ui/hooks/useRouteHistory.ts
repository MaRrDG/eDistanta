import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { HistoryService } from '@services/api/historyService';
import type { RecordSearchPayload, PaginatedRouteHistory } from '@core/entities/history';
import { getBrowserFingerprint } from '@utils/fingerprint';

export const ROUTE_HISTORY_QUERY_KEY = 'routeHistory';

export const useUserRouteHistory = (page: number = 1) => {
    const fingerprint = getBrowserFingerprint();

    return useQuery<PaginatedRouteHistory, Error>({
        queryKey: [ROUTE_HISTORY_QUERY_KEY, fingerprint, page],
        queryFn: () => HistoryService.getHistory(page),
        enabled: !!fingerprint,
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        placeholderData: keepPreviousData, // Prevent UI from disappearing when switching pages
    });
};

export const useSaveRouteSearch = () => {
    const queryClient = useQueryClient();
    const fingerprint = getBrowserFingerprint();

    return useMutation<void, Error, RecordSearchPayload>({
        mutationFn: (payload) => HistoryService.recordSearch(payload),
        // We invalidate the history query so the UI updates
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ROUTE_HISTORY_QUERY_KEY, fingerprint],
            });
        },
    });
};
