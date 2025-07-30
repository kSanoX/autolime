import React, { useState } from 'react'
import ManagerOrder from '../ManagerOrder'

const statuses = ['New', 'Confirm', 'Rescheduled', 'Expired', 'Deleted']
const filters = ['New', 'Confirmed', 'Sheduled', 'All']

const orders = [
  { status: 'Expired', date: '23 June 2023 · 17:00' },
  { status: 'New', date: '23 June 2023 · 17:00' },
  { status: 'Rescheduled', date: '23 June 2023 · 17:00' },
  { status: 'Rescheduled', date: '23 June 2023 · 17:00' },
  { status: 'Deleted', date: '23 June 2023 · 17:00' },
  { status: 'Confirm', date: '23 June 2023 · 17:00' },
]

export default function Booking() {
  const [activeStatus, setActiveStatus] = useState('New')

  const filteredOrders = orders.filter(order => {
    if (activeStatus === 'All') return true
    if (activeStatus === 'Sheduled') return order.status === 'Rescheduled'
    if (activeStatus === 'Confirmed') return order.status === 'Confirm'
    return order.status === activeStatus
  })

  return (
    <div>
      <header>Booking</header>

      <div className="reservation-staus-bar">
        
        <ul>
          {filters.map(label => (
            <li
              key={label}
              onClick={() => setActiveStatus(label)}
              className={`status-bar-item ${activeStatus === label ? 'active' : ''}`}
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
  filteredOrders.map((order, index) => (
    <ManagerOrder
      key={index}
      status={order.status}
      date={order.date}
      type="Complex washing"
      customer={{ name: 'Ivy Levan', phone: '+995 500 777 777' }}
    />
  ))
)}

    </div>
  )
}
