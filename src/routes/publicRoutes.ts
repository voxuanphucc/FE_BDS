import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '../pages/Home/Home';
import About from '../pages/About';
import AddPostPage from '../pages/AddPostPage/AddPostPage';
import PostDetailPage from '../pages/PostDetail/PostDetailPage';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';

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
  {
    path: '/post/:postId',
    element: React.createElement(PostDetailPage),
  },
];
