import { Request, Response } from 'express';
import { RouteSearchUseCases } from '@application/use-cases/RouteSearchUseCases';
import { logError } from '@config/logger';

export class RouteSearchController {
    constructor(private searchUseCases: RouteSearchUseCases) { }

    // POST /api/v1/history/record - Record new search
    public recordSearch = async (req: Request, res: Response): Promise<void> => {
        const requestId = req.headers['x-request-id'];
        try {
            const fingerprint = req.fingerprint || req.body.fingerprint;

            if (!fingerprint) {
                res.status(400).json({
                    success: false,
                    message: 'Fingerprint is required',
                });
                return;
            }

            // Respond immediately with 202 Accepted
            res.status(202).json({
                success: true,
                message: 'Search recording accepted',
            });

            // Process asynchronously
            this.searchUseCases.recordSearch({
                fingerprint,
                startName: req.body.startName,
                startLat: req.body.startLat,
                startLng: req.body.startLng,
                endName: req.body.endName,
                endLat: req.body.endLat,
                endLng: req.body.endLng,
                waypoints: req.body.waypoints,
                isRoundTrip: req.body.isRoundTrip,
                distanceKm: req.body.distanceKm,
                estimatedTimeMins: req.body.estimatedTimeMins,
            }).catch(error => {
                logError('Async error recording route search', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    requestId,
                });
            });
        } catch (error) {
            logError('Error accepting search record', {
                error: error instanceof Error ? error.message : 'Unknown error',
                requestId,
            });
        }
    };

    // GET /api/v1/history/:fingerprint - Get history for fingerprint
    public getHistory = async (req: Request, res: Response): Promise<void> => {
        const requestId = req.headers['x-request-id'];
        try {
            const fingerprint = req.params.fingerprint || req.fingerprint || req.headers['x-browser-fingerprint'];
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;

            if (!fingerprint) {
                res.status(400).json({
                    success: false,
                    message: 'Fingerprint is required',
                });
                return;
            }

            const historyResult = await this.searchUseCases.getRecentSearches(fingerprint as string, page, limit);

            res.json({
                success: true,
                data: historyResult.data,
                count: historyResult.data.length,
                total: historyResult.total,
                totalPages: Math.ceil(historyResult.total / limit),
                currentPage: page
            });
        } catch (error) {
            logError('Error fetching search history', {
                error: error instanceof Error ? error.message : 'Unknown error',
                requestId,
            });
            res.status(500).json({
                success: false,
                message: 'Error fetching search history',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };
}
