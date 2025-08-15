import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '../pages/Home/Home';
import About from '../pages/About';
import PostDetailPage from '../pages/PostDetail/PostDetailPage';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import Logout from '../pages/Logout/Logout';

export const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: React.createElement(LoginPage),
  },
  {
    path: '/register',
    element: React.createElement(RegisterPage),
  },
  {
    path: '/home',
    element: React.createElement(Home),
  },
  {
    path: '/',
    element: React.createElement(Home),
  },
  {
    path: '/about',
    element: React.createElement(About),
  },
  {
    path: '/logout',
    element: React.createElement(Logout),
  },
  {
    path: '/post/:postId',
    element: React.createElement(PostDetailPage),
  },
];