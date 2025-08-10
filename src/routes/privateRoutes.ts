import React from 'react';
import { RouteObject } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

export const privateRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: React.createElement(Dashboard),
  },
];
