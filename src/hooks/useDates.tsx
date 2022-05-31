import { format, isAfter, isBefore, isEqual } from 'date-fns';
import React, { useCallback } from 'react';

export function useDates() {
  const TODAY = new Date().toISOString();
  const getDateString = (date: string) => format(new Date(date), 'yyyy-MM-dd');

  const getDaysAgoString = useCallback((daysAgo: number) => {
    const xDaysAgo = new Date();
    xDaysAgo.setDate(xDaysAgo.getDate() - daysAgo);
    return getDateString(xDaysAgo.toISOString());
  }, []);

  const getEntriesBetween = useCallback(
    ({
      consumedAt,
      olderDate,
      recentDate,
    }: {
      consumedAt: string;
      olderDate: string;
      recentDate: string;
    }) => {
      const dateConsumed = new Date(consumedAt);
      const olderDaysAgo = new Date(olderDate);
      const recentDaysAgo = new Date(recentDate);

      return (
        (isAfter(dateConsumed, olderDaysAgo) ||
          isEqual(dateConsumed, olderDaysAgo)) &&
        (isBefore(dateConsumed, recentDaysAgo) ||
          isEqual(dateConsumed, recentDaysAgo))
      );
    },
    [],
  );

  return {
    TODAY,
    getDateString,
    getDaysAgoString,
    getEntriesBetween,
  };
}
