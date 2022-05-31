import React, { useCallback, useState } from 'react';

export const useBoolean = (initialState: boolean) => {
  const [value, setValue] = useState(initialState);
  return {
    value,
    set: setValue,
    setFalse: useCallback(() => setValue(false), []),
    setTrue: useCallback(() => setValue(true), []),
    toggle: useCallback(() => setValue(v => !v), []),
  };
};
