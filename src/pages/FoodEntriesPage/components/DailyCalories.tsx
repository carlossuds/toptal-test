import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';

type Props = { day: string; calories: number; hasReachedDailyLimit: boolean };

const TIMEZONE_OFFSET = 'T03:00:00';

export function DailyCalories({ day, calories, hasReachedDailyLimit }: Props) {
  return (
    <Box
      sx={{
        border: `2px solid ${hasReachedDailyLimit ? '#ff7961' : '#002984'}`,
        borderRadius: 4,
      }}
      width={200}
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={2}
      gap={2}
    >
      <Typography variant="h4">
        {format(new Date(day.concat(TIMEZONE_OFFSET)), 'MMM dd, yyyy')}
      </Typography>
      <Typography variant="body2">{calories} calories</Typography>
    </Box>
  );
}
