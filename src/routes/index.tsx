import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes } from './publicRoutes';
import { Link } from "react-router-dom";
import { privateRoutes } from './privateRoutes';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const AppRouter: React.FC = () => {
  // Mock authentication check - replace with actual auth logic
  const isAuthenticated = false;

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}

            {/* Private Routes */}
            {privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  isAuthenticated ? (
                    route.element
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            ))}

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>


                    <Link
                      to="/"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Go back home
                    </Link>

                  </div>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
