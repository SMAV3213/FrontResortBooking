import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout/Layout'

import Home from '../pages/Home/Home'
import Types from '../pages/Types'
import About from '../pages/AboutUs/AboutUs'

import Login from '../pages/Auth/Login/Login'
import Register from '../pages/Auth/Register/Register'
import Forbidden from '../pages/Forbidden/Forbidden'

import ProtectedRoute from '../auth/ProtectedRoute'
import { ERole } from '../types/userDTOs'
import Profile from '../pages/Profile/Profile'
import AdminPanel from '../pages/Admin/Admin'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'rooms', element: <Types /> },
      { path: 'about', element: <About /> },

      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forbidden', element: <Forbidden /> },

      {
        element: <ProtectedRoute />,
        children: [{ path: 'profile', element: <Profile /> }],
      },

      {
        element: <ProtectedRoute role={ERole.Admin} />,
        children: [{ path: 'admin', element: <AdminPanel /> }],
      },
    ],
  },
])