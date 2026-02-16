import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { CurrentWeather, WeatherAlert } from '../../../types/weather';

interface WeatherInfoProps {
    weather: CurrentWeather;
    alerts?: WeatherAlert[];
    locationName?: string;
}

export const WeatherInfo = ({ weather, alerts, locationName }: WeatherInfoProps) => {
    const { t } = useTranslation();
    const hasAlerts = alerts && alerts.length > 0;

    // Determine theme based on weather
    const isRain = weather.condition.text.toLowerCase().includes('rain') || weather.condition.text.toLowerCase().includes('drizzle');
    const isSnow = weather.condition.text.toLowerCase().includes('snow') || weather.condition.text.toLowerCase().includes('ice');
    const isSunny = !isRain && !isSnow && (weather.condition.text.toLowerCase().includes('sunny') || weather.condition.text.toLowerCase().includes('clear'));

    // Light Theme Styles (Brand: White & Blue)
    let bgClass = "bg-white/95";
    let borderClass = "border-blue-100";
    let textAccent = "text-blue-600";
    let glowClass = "shadow-lg shadow-blue-900/5";

    if (isSunny) {
        bgClass = "bg-gradient-to-br from-amber-50/95 to-white/95";
        borderClass = "border-amber-200";
        textAccent = "text-amber-500";
    } else if (isRain) {
        bgClass = "bg-gradient-to-br from-blue-50/95 to-white/95";
        borderClass = "border-blue-200";
        textAccent = "text-blue-600";
    } else if (isSnow) {
        bgClass = "bg-gradient-to-br from-cyan-50/95 to-white/95";
        borderClass = "border-cyan-200";
        textAccent = "text-cyan-600";
    } else if (hasAlerts) {
        bgClass = "bg-gradient-to-br from-red-50/95 to-white/95";
        borderClass = "border-red-200";
        textAccent = "text-red-500";
    }

    // Optimize icon size
    const iconUrl = weather.condition.icon.replace('64x64', '128x128');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`
        relative overflow-hidden
        ${bgClass} backdrop-blur-md
        border ${borderClass}
        rounded-2xl p-3 md:p-4
        min-w-[200px] max-w-[240px]
        ${glowClass}
        font-sans
      `}
        >
            {/* Header: Location & Label */}
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div>
                    <h3 className="text-sm md:text-base font-bold leading-tight text-slate-800 uppercase truncate max-w-[140px] mt-1">
                        {locationName || "Unknown"}
                    </h3>
                </div>

                {/* Weather Icon */}
                <div className="absolute -right-2 -top-2">
                    <img
                        src={iconUrl}
                        alt={weather.condition.text}
                        className="w-14 h-14 object-contain drop-shadow-sm"
                    />
                </div>
            </div>

            {/* Hero: Temperature */}
            <div className="relative z-10 mb-3">
                <div className="flex items-baseline">
                    <span className="text-5xl md:text-6xl font-black tracking-tighter text-slate-800">
                        {Math.round(weather.temp_c)}°
                    </span>
                </div>
                <p className={`text-sm font-semibold ${textAccent} mt-1 first-letter:uppercase leading-none`}>
                    {t(`weather.conditions.${weather.condition.text.replace(/ /g, '_')}`, weather.condition.text)}
                </p>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {t('weather.feelsLike')} {Math.round(weather.feelslike_c)}°
                </p>
            </div>

            {/* Feature Grid (Compact) */}
            <div className="flex gap-4 relative z-10 border-t border-slate-100 pt-2">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">{t('weather.wind')}</span>
                    <span className="text-xs font-bold text-slate-700">{Math.round(weather.wind_kph)} <span className="text-[9px] font-normal text-slate-500">{t('units.km')}/{t('units.hour')}</span></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">{t('weather.humidity')}</span>
                    <span className="text-xs font-bold text-slate-700">{weather.humidity}%</span>
                </div>
            </div>

            {/* Alerts Section */}
            {hasAlerts && (
                <div className="mt-2 bg-red-50 border border-red-100 rounded-md p-2 flex items-start gap-2 relative z-10">
                    <span className="text-sm animate-pulse">⚠️</span>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide truncate">
                            {alerts[0].event}
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
