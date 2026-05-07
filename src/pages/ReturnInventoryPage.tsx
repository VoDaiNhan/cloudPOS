import { useState } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useReturnInventoryStore } from '../store/returnInventoryStore'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const ReturnInventoryPage = () => {
  const { items, removeItem, applyDiscount } = useReturnInventoryStore()
  const [selectedStatus, setSelectedStatus] = useState('Tất cả trạng thái')
  const [selectedTime, setSelectedTime] = useState('Thời gian trả: Gần đây')
  
  // Bulk discount state
  const [bulkDiscountStatus, setBulkDiscountStatus] = useState('Tất cả lỗi nhẹ & trầy xước')
  const [bulkDiscountVal, setBulkDiscountVal] = useState('20')

  // Top level stats
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * 1250000), 0) // Mock 1,250,000 VND per item roughly
  const pendingCount = items.filter(i => i.discountPercentage === 0).length
  const discountedCount = items.filter(i => i.discountPercentage > 0).length

  const handleBulkDiscount = () => {
    const val = parseInt(bulkDiscountVal, 10);
    if(isNaN(val) || val < 0) return alert('Vui lòng nhập phần trăm hợp lệ!');
    
    let appliedCount = 0;
    items.forEach(item => {
      let shouldApply = false;
      if (bulkDiscountStatus === 'Tất cả lỗi nhẹ & trầy xước') {
        shouldApply = item.status === 'Lỗi nhẹ' || item.status === 'Trầy xước';
      } else {
        shouldApply = item.status === bulkDiscountStatus;
      }
      if (shouldApply) {
        applyDiscount(item.id, val);
        appliedCount++;
      }
    });
    alert(`Đã áp dụng giảm giá ${val}% cho ${appliedCount} sản phẩm thuộc nhóm ${bulkDiscountStatus.toLowerCase()}`)
  }

  return (
    <DashboardLayout title="Quản lý Tồn kho Hàng Đổi trả" breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Tồn kho Đổi trả' }]}>
      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Quản lý Tồn kho Hàng Đổi trả
          </h2>
          <p className="text-slate-500 mt-1">
            Theo dõi, kiểm định và xử lý thanh lý hàng trả kho.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all active:scale-95">
            <span className="material-symbols-outlined">sell</span>
            Tạo giảm giá thanh lý
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-slate-200/50 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Tổng giá trị tồn trả (Ước tính)
            </p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{formatCurrency(totalValue)}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-slate-200/50 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Chờ thiết lập
            </p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{pendingCount} sản phẩm</h3>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-slate-200/50 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Đã áp giảm giá
            </p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{discountedCount} mặt hàng</h3>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700">
            <span className="material-symbols-outlined">price_check</span>
          </div>
        </div>
      </div>

      {/* Filters & Main Table Canvas */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-slate-200/50">
        {/* Filter Bar */}
        <div className="p-6 border-b border-slate-200/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <select
                className="appearance-none bg-slate-50 text-sm font-medium pl-4 pr-10 py-2.5 rounded-lg border-none focus:ring-2 ring-primary/20 min-w-[160px] text-slate-700"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>Tất cả trạng thái</option>
                <option>Mới</option>
                <option>Trầy xước</option>
                <option>Lỗi nhẹ</option>
                <option>Hàng trưng bày</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                expand_more
              </span>
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-slate-50 text-sm font-medium pl-4 pr-10 py-2.5 rounded-lg border-none focus:ring-2 ring-primary/20 min-w-[160px] text-slate-700"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option>Thời gian trả: Gần đây</option>
                <option>Trong 7 ngày qua</option>
                <option>Trong 30 ngày qua</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                calendar_today
              </span>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            Hiển thị <strong className="text-slate-900">10</strong> trên <strong className="text-slate-900">42</strong> kết quả
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Mã phiếu</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Sản phẩm</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Số lượng</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Trạng thái hàng</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Giảm giá áp dụng</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5 font-mono text-sm font-semibold text-slate-900">{item.orderRef}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                        {item.imageUrl ? (
                           <img
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            src={item.imageUrl}
                          />
                        ) : (
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">image</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.productName}</p>
                        <p className="text-xs text-slate-500">Trả kho: {item.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-sm text-slate-900">{item.quantity.toString().padStart(2, '0')}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-lg tracking-wide uppercase ${
                      item.status === 'Mới' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'Trầy xước' ? 'bg-slate-200 text-slate-600' :
                      item.status === 'Lỗi nhẹ' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className={`px-6 py-5 text-right font-bold ${item.discountPercentage > 0 ? 'text-error' : 'text-primary'}`}>
                    {item.discountPercentage}%
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          if (confirm(`Bạn muốn đưa ${item.productName} ra quầy bán lại? (Thao tác này sẽ xóa khỏi hàng lỗi)`)) {
                            removeItem(item.id);
                          }
                        }}
                        className="p-2 hover:bg-blue-100 rounded-lg text-primary transition-colors" title="Bán lại">
                        <span className="material-symbols-outlined text-[20px]">storefront</span>
                      </button>
                      <button 
                        onClick={() => {
                          const val = prompt(`Nhập phần trăm giảm giá cho ${item.productName} (VD: 15):`, item.discountPercentage.toString());
                          if (val !== null && !isNaN(parseInt(val, 10))) {
                            applyDiscount(item.id, parseInt(val, 10));
                          }
                        }}
                        className="p-2 hover:bg-orange-100 rounded-lg text-orange-600 transition-colors" title="Thanh lý">
                        <span className="material-symbols-outlined text-[20px]">local_offer</span>
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Bạn chắc chắn muốn xuất huỷ mặt hàng ${item.productName} này?`)) {
                            removeItem(item.id);
                          }
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg text-error transition-colors" title="Hủy hàng">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500">Trang 1 trên 5</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-container text-white font-bold text-xs">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 transition-colors text-xs font-bold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 transition-colors text-xs font-bold">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Layout Section for Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        {/* Liquidation Config Panel */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl border border-slate-200/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold tracking-tight text-slate-900">Thiết lập giảm giá thanh lý nhanh</h4>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Áp dụng hàng loạt</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-slate-500 uppercase tracking-widest">
                Trạng thái áp dụng
              </label>
              <select 
                value={bulkDiscountStatus}
                onChange={(e) => setBulkDiscountStatus(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-lg text-sm p-3 focus:ring-primary focus:ring-2 text-slate-700">
                <option>Tất cả lỗi nhẹ & trầy xước</option>
                <option>Lỗi nhẹ</option>
                <option>Trầy xước</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-slate-500 uppercase tracking-widest">
                % Giảm giá chung
              </label>
              <div className="relative">
                <input
                  value={bulkDiscountVal}
                  onChange={(e) => setBulkDiscountVal(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-lg text-sm p-3 focus:ring-primary focus:ring-2 text-slate-900"
                  placeholder="20"
                  type="number"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
              </div>
            </div>
            <div className="flex items-end">
              <button 
                onClick={handleBulkDiscount}
                className="w-full bg-primary py-3 rounded-lg text-white font-bold text-sm hover:shadow-lg transition-all active:scale-95">
                Thực hiện thiết lập
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 bg-primary p-8 rounded-xl text-white shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold tracking-tight mb-2">Trung tâm xử lý nhanh</h4>
            <p className="text-blue-100 text-xs font-medium leading-relaxed">
              Chọn các mặt hàng trong danh sách để kích hoạt các hành động hàng loạt bên dưới.
            </p>
          </div>
          <div className="space-y-3 mt-6">
            <button 
              onClick={() => {
                if (items.length === 0) return alert('Không có hàng trong kho!');
                if (confirm('Tất cả mặt hàng đang hiển thị sẽ được chuyển ra quầy bán lại?')) {
                  items.forEach(i => removeItem(i.id))
                  alert('Chuyển thành công!');
                }
              }}
              className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
                <span className="text-sm font-bold">Đưa ra bán lại</span>
              </div>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button 
              onClick={() => {
                const discountItems = items.filter(i => i.discountPercentage > 0);
                if (discountItems.length === 0) return alert('Chưa có mặt hàng nào được áp giảm giá!');
                alert(`Đã chốt thanh lý cho ${discountItems.length} mặt hàng!`);
              }}
              className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group text-orange-200">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">local_offer</span>
                <span className="text-sm font-bold">Chốt thanh lý</span>
              </div>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button 
              onClick={() => {
                if (items.length === 0) return alert('Không có hàng trong kho!');
                if (confirm('Hủy bỏ toàn bộ hàng tồn kho đang có? (Không thể hoàn tác)')) {
                  items.forEach(i => removeItem(i.id))
                }
              }}
              className="w-full flex items-center justify-between p-3 bg-error hover:bg-error/80 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">delete</span>
                <span className="text-sm font-bold">Hủy bỏ vĩnh viễn</span>
              </div>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}

export default ReturnInventoryPage
