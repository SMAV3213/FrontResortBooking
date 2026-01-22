import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import Home from '../pages/Home'
import Types from '../pages/Types'
import About from '../components/AboutUs/AboutUs'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'rooms', element: <Types /> },
      { path: 'about', element: <About /> }
    ],
  },
])