import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import './styles/global.scss'
import { AuthProvider } from './auth/AuthProvider'
import { ThemeProvider } from './theme/ThemeProvidet'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
