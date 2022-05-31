import React, { createContext, useState } from 'react';
import decode from 'jwt-decode';
import { UserType } from '../types';

type AuthContextData = {
  user: UserType;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

type Props = { children: React.ReactNode };

export function AuthProvider({ children }: Props) {
  const [data] = useState(() => {
    const token = localStorage.getItem('@toptal:token');

    if (token) {
      return { user: decode<UserType>(token) };
    }
    return {} as AuthContextData;
  });

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}
