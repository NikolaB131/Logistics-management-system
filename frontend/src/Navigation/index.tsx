import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import AuthPage from '../pages/AuthPage';
import ClientsPage from '../pages/ClientsPage';
import CouriersPage from '../pages/CouriersPage';
import OrdersPage from '../pages/OrdersPage';
import ProfilePage from '../pages/ProfilePage';
import RootPage from '../pages/RootPage';
import StatisticsPage from '../pages/StatisticsPage';
import WarehousePage from '../pages/WarehousePage';
import RequireAuth from './RequireAuth';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <RootPage />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="orders" replace /> },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'clients',
        element: <ClientsPage />,
      },
      {
        path: 'couriers',
        element: <CouriersPage />,
      },
      {
        path: 'warehouse',
        element: <WarehousePage />,
      },
      {
        path: 'statistics',
        element: <StatisticsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
]);

const Navigation = () => <RouterProvider router={router} />;

export default Navigation;
