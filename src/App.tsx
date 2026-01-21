import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import './styles/global.scss'

function App() {
  return <RouterProvider router={router} />
}

export default App
