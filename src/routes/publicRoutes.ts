import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '../pages/Home/Home';
import About from '../pages/About';
import AddPostPage from '../pages/AddPostPage/AddPostPage';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: React.createElement(Home),
  },
  {
    path: '/about',
    element: React.createElement(About),
  },
  {
    path: '/add-post',
    element: React.createElement(AddPostPage),
  },
];
