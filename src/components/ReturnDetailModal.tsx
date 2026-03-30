import type { ReturnOrder } from '../types/returnExchange'
import { getReturnReasonLabel, returnConditions } from '../mock/returnExchange'

interface ReturnDetailModalProps {
  returnOrder: ReturnOrder
  onClose: () => void
  onPrint?: () => void
}

export const ReturnDetailModal = ({
  returnOrder,
  onClose,
  onPrint,
}: ReturnDetailModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'emerald'
      case 'pending':
        return 'amber'
      case 'approved':
        return 'blue'
      case 'rejected':
        return 'rose'
      default:
        return 'slate'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành'
      case 'pending':
        return 'Chờ xử lý'
      case 'approved':
        return 'Đã duyệt'
      case 'rejected':
        return 'Từ chối'
      default:
        return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cancel':
        return 'Hủy giao dịch'
      case 'return':
        return 'Trả hàng hoàn tiền'
      case 'exchange':
        return 'Đổi hàng'
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cancel':
        return 'rose'
      case 'return':
        return 'blue'
      case 'exchange':
        return 'emerald'
      default:
        return 'slate'
    }
  }

  const statusColor = getStatusColor(returnOrder.status)
  const typeColor = getTypeColor(returnOrder.type)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`bg-linear-to-r from-${typeColor}-500 to-${typeColor}-600 p-6 text-white`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-black">{returnOrder.returnNumber}</h2>
                <span
                  className={`px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest`}
                >
                  {getTypeLabel(returnOrder.type)}
                </span>
              </div>
              <p className="text-sm opacity-90">
                Ngày tạo: {new Date(returnOrder.returnDate).toLocaleString('vi-VN')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="size-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full bg-${statusColor}-100 text-${statusColor}-700 text-sm font-black flex items-center gap-2`}
            >
              <span className="material-symbols-outlined text-sm">
                {returnOrder.status === 'completed'
                  ? 'check_circle'
                  : returnOrder.status === 'pending'
                  ? 'schedule'
                  : returnOrder.status === 'approved'
                  ? 'verified'
                  : 'cancel'}
              </span>
              {getStatusLabel(returnOrder.status)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                Hóa đơn gốc
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Mã hóa đơn:</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {returnOrder.originalOrderNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Ngày mua:</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {new Date(returnOrder.originalOrderDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Tổng giá trị:</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {returnOrder.originalOrderTotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                Khách hàng
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-lg">person</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {returnOrder.customerName || 'Khách lẻ'}
                  </span>
                </div>
                {returnOrder.customerPhone && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-lg">call</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {returnOrder.customerPhone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              Danh sách sản phẩm ({returnOrder.items.length})
            </h3>

            <div className="space-y-3">
              {returnOrder.items.map((item, index) => {
                const conditionInfo = returnConditions.find((c) => c.value === item.condition)

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                            {index + 1}
                          </span>
                          <p className="font-black text-slate-900 dark:text-white">
                            {item.productName}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                          <span>Đã mua: {item.originalQuantity}</span>
                          <span>•</span>
                          <span>Trả: {item.returnQuantity}</span>
                          <span>•</span>
                          <span>{item.returnPrice.toLocaleString('vi-VN')}đ/sp</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                          {item.returnAmount.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">Lý do:</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {getReturnReasonLabel(item.reason)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-1">Tình trạng:</p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-${conditionInfo?.color}-100 text-${conditionInfo?.color}-700 text-xs font-bold`}
                        >
                          {conditionInfo?.label}
                        </span>
                      </div>
                    </div>

                    {item.reasonNote && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <p className="text-xs font-bold text-slate-500 mb-1">Ghi chú:</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {item.reasonNote}
                        </p>
                      </div>
                    )}

                    {/* Warehouse */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <span className="material-symbols-outlined text-sm">warehouse</span>
                      <span>
                        Nhập vào:{' '}
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.warehouse === 'main'
                            ? 'Kho bán lại'
                            : item.warehouse === 'defective'
                            ? 'Kho lỗi'
                            : item.warehouse === 'clearance'
                            ? 'Kho giảm giá'
                            : 'Kho chờ kiểm tra'}
                        </span>
                      </span>
                    </div>

                    {/* Exchange Info */}
                    {item.exchangeProductId && (
                      <div className="mt-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                          Đổi sang:
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-emerald-900 dark:text-emerald-100">
                            {item.exchangeProductName}
                          </p>
                          <p className="font-black text-emerald-900 dark:text-emerald-100">
                            {item.exchangeAmount?.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">
              Tổng kết tài chính
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Tổng giá trị hàng trả:
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {returnOrder.subtotal.toLocaleString('vi-VN')}đ
                </span>
              </div>

              {returnOrder.refundAmount > 0 && (
                <div className="flex items-center justify-between pt-3 border-t border-primary/20">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Số tiền hoàn lại:
                  </span>
                  <span className="text-2xl font-black text-rose-600">
                    {returnOrder.refundAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              )}

              {returnOrder.additionalCharge > 0 && (
                <div className="flex items-center justify-between pt-3 border-t border-primary/20">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Số tiền thu thêm:
                  </span>
                  <span className="text-2xl font-black text-emerald-600">
                    {returnOrder.additionalCharge.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              )}

              {/* Refund Method */}
              <div className="flex items-center justify-between pt-3 border-t border-primary/20">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Phương thức hoàn tiền:
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {returnOrder.refundMethod === 'cash'
                    ? 'Tiền mặt'
                    : returnOrder.refundMethod === 'bank_transfer'
                    ? 'Chuyển khoản'
                    : returnOrder.refundMethod === 'card'
                    ? 'Thẻ'
                    : returnOrder.refundMethod === 'ewallet'
                    ? 'Ví điện tử'
                    : 'Tích điểm'}
                </span>
              </div>

              {returnOrder.refundReference && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Mã tham chiếu:
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                    {returnOrder.refundReference}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {returnOrder.notes && (
            <div className="rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                Ghi chú
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">{returnOrder.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
              Thông tin khác
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500 mb-1">Người tạo:</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {returnOrder.createdBy}
                </p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Ngày tạo:</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {new Date(returnOrder.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
              {returnOrder.approvedBy && (
                <>
                  <div>
                    <p className="text-slate-500 mb-1">Người duyệt:</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {returnOrder.approvedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Ngày duyệt:</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {returnOrder.approvedAt
                        ? new Date(returnOrder.approvedAt).toLocaleString('vi-VN')
                        : '-'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 py-3 font-black text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Đóng
          </button>
          {onPrint && (
            <button
              onClick={onPrint}
              className="flex-1 rounded-xl bg-primary py-3 font-black text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">print</span>
              In phiếu
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
