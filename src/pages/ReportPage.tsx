import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { UserNameAndBadge } from '../components';
import { useFoodEntry, useAuth, useDates } from '../hooks';
import { PagePaths } from '../enums';

export function ReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user.isAdmin) {
    navigate(PagePaths.FOOD_ENTRIES);
  }

  const { foodEntries } = useFoodEntry();
  const { TODAY, getDaysAgoString, getEntriesBetween } = useDates();

  const sevenDaysAgoString = getDaysAgoString(7);
  const fourteenDaysAgoString = getDaysAgoString(14);

  const foodEntriesFromLastSevenDays = foodEntries.filter(({ consumedAt }) =>
    getEntriesBetween({
      consumedAt,
      olderDate: sevenDaysAgoString,
      recentDate: TODAY,
    }),
  );

  const foodEntriesFromWeekBefore = foodEntries.filter(({ consumedAt }) =>
    getEntriesBetween({
      consumedAt,
      olderDate: fourteenDaysAgoString,
      recentDate: sevenDaysAgoString,
    }),
  );

  const numberOfUsers = [
    ...new Set(foodEntries.map(({ createdBy }) => createdBy.id)),
  ].length;

  const caloriesLast7days = foodEntriesFromLastSevenDays.reduce(
    (acc, { calories, cheat }) => (cheat ? acc : acc + calories),
    0,
  );

  return (
    <Box>
      {user.isAdmin && (
        <Box
          display="flex"
          flexDirection="column"
          margin="auto"
          maxWidth={1280}
          alignItems="center"
          gap={3}
        >
          <Box width="100%" display="flex" justifyContent="space-between">
            <UserNameAndBadge />
          </Box>

          <Box display="flex" alignItems="flex-end" gap={3}>
            <Link to="/">
              <Typography variant="h6">Food entries</Typography>
            </Link>
            <Typography variant="h2">Report</Typography>
          </Box>

          <Typography>
            Entries Last Week (with today) {foodEntriesFromLastSevenDays.length}
          </Typography>

          <Typography>
            Entries the week Before: {foodEntriesFromWeekBefore.length}
          </Typography>

          <Typography>
            <Typography variant="h4">Last 7 Days</Typography>
            <Typography>Total Calories: {caloriesLast7days}</Typography>
            <Typography># of active users: {numberOfUsers}</Typography>
            Average: {caloriesLast7days / numberOfUsers} calorie/user
          </Typography>
        </Box>
      )}
    </Box>
  );
}
