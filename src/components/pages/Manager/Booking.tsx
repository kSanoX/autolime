import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ManagerOrder from '../../ManagerOrder'
import DeleteReasonPopup from '../../DeleteReasonPopup'
import { type RootState } from '../../../store'
import { deleteOrder } from '../../../store/ordersSlice'

type Status = 'Confirm' | 'Rescheduled' | 'Expired' | 'Deleted' | 'New'
type Filter = 'New' | 'Confirmed' | 'Sheduled' | 'All'

const filters: Filter[] = ['New', 'Confirmed', 'Sheduled', 'All']

export default function Booking() {
  const orders = useSelector((state: RootState) => state.orders)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [activeStatus, setActiveStatus] = useState<Filter>('New')
  const [popupVisible, setPopupVisible] = useState(false)
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(null)
  const [deleteReason, setDeleteReason] = useState('')

  const filteredOrders = orders.filter((order) => {
    if (activeStatus === 'All') return true
    if (activeStatus === 'Sheduled') return order.status === 'Rescheduled'
    if (activeStatus === 'Confirmed') return order.status === 'Confirm'
    return order.status === activeStatus
  })

  const handleDelete = (index: number) => {
    setSelectedOrderIndex(index)
    setPopupVisible(true)
  }

  const confirmDelete = () => {
    if (selectedOrderIndex !== null) {
      const orderId = filteredOrders[selectedOrderIndex].id
      dispatch(deleteOrder(orderId))
    }
    setDeleteReason('')
    setPopupVisible(false)
    setSelectedOrderIndex(null)
  }

  const handleReschedule = (index: number) => {
    const order = filteredOrders[index]
    navigate(`/reschedule/${order.id}`, {
      state: {
        selectedDate: order.date,
        orderId: order.id,
      },
    })
  }

  return (
    <div>
      <header>Booking</header>

      <div className="reservation-staus-bar">
        <ul>
          {filters.map((label) => (
            <li
              key={label}
              onClick={() => setActiveStatus(label)}
              className={`status-bar-item ${
                activeStatus === label ? 'active' : ''
              }`}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-message">
          You haven't left any new orders
        </div>
      ) : (
        filteredOrders.map((order, idx) => (
          <ManagerOrder
            key={order.id}
            status={order.status}
            date={order.date}
            type="Complex washing"
            customer={{ name: 'Ivy Levan', phone: '+995 500 777 777' }}
            onDelete={() => handleDelete(idx)}
            onReschedule={() => handleReschedule(idx)}
          />
        ))
      )}

      <DeleteReasonPopup
        visible={popupVisible}
        reason={deleteReason}
        setReason={setDeleteReason}
        onCancel={() => setPopupVisible(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
