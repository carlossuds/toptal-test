import {
  InputLabel,
  Input as MuiInput,
  InputProps,
  FormControl,
} from '@mui/material';
import React from 'react';

type Props = { label: string } & InputProps;

export function Input({ label, ...rest }: Props) {
  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <MuiInput {...rest} />
    </FormControl>
  );
}
