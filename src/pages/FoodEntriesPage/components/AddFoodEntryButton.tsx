import { Alert, Box, Button } from '@mui/material';
import React from 'react';
import { useAuth } from '../../../hooks';

type Props = {
  consumedCaloriesToday: number;
  onClick: () => void;
};

export function AddFoodEntryButton({ consumedCaloriesToday, onClick }: Props) {
  const { user } = useAuth();

  return (
    <Box ml="auto" display="flex">
      {consumedCaloriesToday >= user.calorieLimit && (
        <Alert severity="warning">
          You have already consumed {consumedCaloriesToday} calories today, the
          daily limit is {user.calorieLimit}.
        </Alert>
      )}
      <Button onClick={onClick}>Add Entry</Button>
    </Box>
  );
}
