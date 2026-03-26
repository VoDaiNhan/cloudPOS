import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/router'
import { ProductStoreProvider } from './store/productStore'

function App() {
  return (
    <ProductStoreProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ProductStoreProvider>
  )
}

export default App
