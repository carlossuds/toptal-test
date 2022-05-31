import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { format } from 'date-fns';
import { FoodType } from '../types';
import { useAuth } from '../hooks';

type Props = FoodType & {
  onClickDelete: () => void;
  onClickEdit: () => void;
};

export function FoodEntry({
  calories,
  cheat,
  consumedAt,
  foodName,
  onClickDelete,
  onClickEdit,
}: Props) {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        border: `2px solid ${cheat ? '#ff7961' : '#002984'}`,
        borderRadius: 4,
      }}
      width={200}
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={2}
      gap={2}
    >
      <Typography variant="h6">{foodName}</Typography>
      <Typography
        variant="body2"
        sx={{ textDecoration: cheat ? 'line-through' : 'none' }}
      >
        {calories} calories
      </Typography>
      <Typography variant="body2">
        {format(new Date(consumedAt), 'MMM dd, yyyy hh:mm')}
      </Typography>

      {user.isAdmin && (
        <Box display="flex" width="80%" justifyContent="space-between">
          <Button variant="outlined" onClick={onClickEdit}>
            EDIT
          </Button>
          <Button color="error" onClick={onClickDelete}>
            DELETE
          </Button>
        </Box>
      )}
    </Box>
  );
}
