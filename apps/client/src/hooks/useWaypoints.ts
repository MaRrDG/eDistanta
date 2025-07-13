import { useState, useCallback } from 'react';
import type { Waypoint, LocationResult } from '../types/location';

export const useWaypoints = () => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  const addWaypoint = useCallback(() => {
    const newWaypoint: Waypoint = {
      id: `waypoint_${Date.now()}`,
      name: '',
      coordinates: [0, 0],
    };
    setWaypoints(prev => [...prev, newWaypoint]);
  }, []);

  const removeWaypoint = useCallback((waypointId: string) => {
    setWaypoints(prev => prev.filter(wp => wp.id !== waypointId));
  }, []);

  const updateWaypointName = useCallback((waypointId: string, name: string) => {
    setWaypoints(prev =>
      prev.map(wp => (wp.id === waypointId ? { ...wp, name } : wp))
    );
  }, []);

  const updateWaypointFromLocation = useCallback(
    (waypointId: string, location: LocationResult) => {
      setWaypoints(prev =>
        prev.map(wp =>
          wp.id === waypointId
            ? { ...wp, name: location.name, coordinates: location.coordinates }
            : wp
        )
      );
    },
    []
  );

  const moveWaypoint = useCallback(
    (waypointId: string, direction: 'up' | 'down') => {
      setWaypoints(prev => {
        const currentIndex = prev.findIndex(wp => wp.id === waypointId);
        if (currentIndex === -1) return prev;

        const newIndex =
          direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= prev.length) return prev;

        const newWaypoints = [...prev];
        [newWaypoints[currentIndex], newWaypoints[newIndex]] = [
          newWaypoints[newIndex],
          newWaypoints[currentIndex],
        ];
        return newWaypoints;
      });
    },
    []
  );

  const getValidWaypoints = useCallback(() => {
    return waypoints.filter(
      wp => wp.name && wp.coordinates[0] !== 0 && wp.coordinates[1] !== 0
    );
  }, [waypoints]);

  const getInvalidWaypoints = useCallback(() => {
    return waypoints.filter(
      wp => !wp.name || (wp.coordinates[0] === 0 && wp.coordinates[1] === 0)
    );
  }, [waypoints]);

  return {
    waypoints,
    addWaypoint,
    removeWaypoint,
    updateWaypointName,
    updateWaypointFromLocation,
    moveWaypoint,
    getValidWaypoints,
    getInvalidWaypoints,
  };
};
