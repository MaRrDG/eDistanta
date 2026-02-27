
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useFuelPriceHistory } from '@ui/hooks/useFuelPrice';

interface FuelPriceHistoryChartProps {
    stationName: string;
    fuelType: string;
    days?: number;
}

const FuelPriceHistoryChart: React.FC<FuelPriceHistoryChartProps> = ({
    stationName,
    fuelType,
    days = 30,
}) => {
    const { t } = useTranslation();
    const { data: historyData, isLoading, error } = useFuelPriceHistory(
        stationName,
        fuelType,
        days
    );

    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !historyData || historyData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg text-gray-500">
                {t('routeDetails.noHistoryData', 'No historical data available')}
            </div>
        );
    }

    // Process data for the chart
    const chartData = historyData
        .map(item => ({
            date: new Date(item.scrapedAt).toLocaleDateString(),
            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
            fullDate: new Date(item.scrapedAt).toLocaleString(),
        }))
        // Sort by date ascending for the chart
        .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

    return (
        <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                        minTickGap={30}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => value.toFixed(2)}
                        width={40}
                    />
                    <Tooltip
                        formatter={(value: any) => [`${Number(value).toFixed(2)} RON`, t('routeDetails.price', 'Price')]}
                        labelFormatter={(label) => t('routeDetails.date', 'Date') + `: ${label}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line
                        type="step"
                        dataKey="price"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                        animationDuration={1000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FuelPriceHistoryChart;
