import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts';
import { PagePaths } from './enums';
import { FoodEntriesPage, ReportPage } from './pages';

const routes = [
  { path: PagePaths.FOOD_ENTRIES, element: <FoodEntriesPage />, exact: true },
  { path: PagePaths.REPORT, element: <ReportPage /> },
];

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(route => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
