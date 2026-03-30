export default function TestPage() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#1c43a6', marginBottom: '20px' }}>
          ✅ React đang hoạt động!
        </h1>
        <p style={{ color: '#666', fontSize: '18px' }}>
          Nếu bạn thấy trang này, React đã render thành công.
        </p>
        <p style={{ color: '#16a34a', fontWeight: 'bold', marginTop: '20px' }}>
          Vấn đề có thể nằm ở một component cụ thể hoặc routing.
        </p>
      </div>
    </div>
  )
}
