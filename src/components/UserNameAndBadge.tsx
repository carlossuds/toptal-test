import React from 'react';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { Typography } from '@mui/material';
import { useAuth } from '../hooks';

export function UserNameAndBadge() {
  const { user } = useAuth();

  return (
    <Typography display="flex" alignItems="center">
      {user.isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}{' '}
      {user.firstName} {user.lastName}
    </Typography>
  );
}
