import React from 'react';
import { RouteObject } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import AddPostPage from '../pages/AddPostPage/AddPostPage';

export const privateRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: React.createElement(Dashboard),
  },
  {
    path: '/add-post',
    element: React.createElement(AddPostPage),
  },
];
