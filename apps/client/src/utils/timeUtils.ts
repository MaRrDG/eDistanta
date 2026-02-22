import type { TFunction } from 'i18next';

export function getRelativeTime(dateString: string, t: TFunction): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) {
        return t('time.justNow', 'Chiar acum');
    }
    if (diffInMins < 60) {
        return t('time.minutesAgo', 'Acum {{count}} minute', { count: diffInMins });
    }
    if (diffInHours < 24) {
        return diffInHours === 1
            ? t('time.oneHourAgo', 'Acum 1 oră')
            : t('time.hoursAgo', 'Acum {{count}} ore', { count: diffInHours });
    }
    if (diffInDays === 1) {
        return t('time.yesterday', 'Ieri');
    }
    if (diffInDays < 7) {
        return t('time.daysAgo', 'Acum {{count}} zile', { count: diffInDays });
    }

    // Fallback to absolute date
    return date.toLocaleDateString(t('common.locale', 'ro-RO'), {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}
