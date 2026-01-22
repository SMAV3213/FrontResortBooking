import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import './styles/global.scss'
import { AuthProvider } from './auth/AuthProvider'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
