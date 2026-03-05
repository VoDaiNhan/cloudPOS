/**
 * Mock utility for exporting data to various formats.
 * In a real application, this would use libraries like 'xlsx' or 'jspdf'.
 */

export const exportToExcel = async (dataName: string) => {
  console.log(`Exporting ${dataName} to Excel...`)
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would trigger a browser download
      alert(`Đã xuất dữ liệu "${dataName}" ra file Excel thành công!`)
      resolve(true)
    }, 1500)
  })
}

export const exportToPDF = async (dataName: string) => {
  console.log(`Exporting ${dataName} to PDF...`)
  
  return new Promise((resolve) => {
    setTimeout(() => {
      alert(`Đã tạo bản in PDF cho "${dataName}" thành công!`)
      resolve(true)
    }, 2000)
  })
}
