import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/router'
import { ProductStoreProvider } from './store/productStore'

function App() {
  // Test mode - uncomment to debug
  // return (
  //   <div style={{ padding: '40px', fontFamily: 'Arial' }}>
  //     <h1 style={{ color: '#1c43a6' }}>✅ React đang hoạt động!</h1>
  //     <p>Nếu bạn thấy dòng này, React đã render thành công.</p>
  //   </div>
  // )

  return (
    <ProductStoreProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ProductStoreProvider>
  )
}

export default App
