import React, { useState } from "react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parse,
} from "date-fns";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import ManagerOrder from "../ManagerOrder";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteOrder } from "@/store/ordersSlice";
import DeleteReasonPopup from "../DeleteReasonPopup";

type Status = "Confirm" | "Rescheduled" | "Expired" | "Deleted" | "New";
const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function ManagerCalendarGrid() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const orders = useSelector((state: RootState) => state.orders);

  // Фильтруем Deleted
  const validOrders = orders.filter((order) => order.status !== "Deleted");

  // Генерация дней месяца
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteReason, setDeleteReason] = useState("");

  const confirmDelete = () => {
    if (selectedOrder) {
      dispatch(deleteOrder(selectedOrder.id));
    }
    setDeleteReason("");
    setSelectedOrder(null);
    setPopupVisible(false);
  };

  const cancelDelete = () => {
    setDeleteReason("");
    setSelectedOrder(null);
    setPopupVisible(false);
  };

  const ordersByDay = new Map<string, Status[]>();
  validOrders.forEach((order) => {
    const parsedDate = parse(order.date, "dd MMMM yyyy · HH:mm", new Date());
    const key = parsedDate.toDateString();
    ordersByDay.set(key, [...(ordersByDay.get(key) || []), order.status]);
  });

  const selectedOrders = validOrders.filter((order) => {
    const parsed = parse(order.date, "dd MMMM yyyy · HH:mm", new Date());

    if (isNaN(parsed.getTime())) {
      console.warn("⛔️ Невозможно распарсить дату для ордера:", order);
      return false;
    }

    return isSameDay(parsed, selectedDate);
  });

  validOrders.forEach((order) => {
    const parsedDate = parse(order.date, "dd MMMM yyyy · HH:mm", new Date());
    if (isNaN(parsedDate.getTime())) {
      console.warn(
        "❌ Invalid order.date:",
        order.date,
        "→ parsed as",
        parsedDate
      );
      return;
    }

    const key = parsedDate.toDateString();
    ordersByDay.set(key, [...(ordersByDay.get(key) || []), order.status]);
  });

  // Подсчёт по статусам
  const countByStatus = {
    new: 0,
    rescheduled: 0,
    confirm: 0,
  };

  selectedOrders.forEach((order) => {
    const key = order.status.toLowerCase();
    if (key in countByStatus) countByStatus[key]++;
  });

  return (
    <div>
      <header>Calendar</header>

      {/* Навигация */}
      <div className='calendar-header'>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          &lt;
        </button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          &gt;
        </button>
      </div>

      <div className='calendar-wrapper'>
        {/* Дни недели */}
        <div className='calendar-daynames'>
          {dayNames.map((day) => (
            <div key={day} className='calendar-dayname'>
              {day}
            </div>
          ))}
        </div>

        {/* Сетка календаря */}
        <div className='calendar-grid'>
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const dayKey = day.toDateString();
            const statusesForDay = ordersByDay.get(dayKey) || [];

            // Только уникальные статусы, без Deleted
            const uniqueStatuses = Array.from(
              new Set(
                statusesForDay
                  .filter((s) => s !== "Deleted")
                  .map((s) => s.toLowerCase())
              )
            );

            return (
              <div
                key={day.toISOString()}
                className={`calendar-cell${isSelected ? " selected" : ""}`}
                onClick={() => setSelectedDate(day)}
              >
                <div>{format(day, "d")}</div>
                <div className='calendar-dots'>
                  {uniqueStatuses.map((status, i) => (
                    <span key={i} className={`dot ${status}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Боковая панель */}
      <div className='date-events'>
        <div className='current-date'>
          <p>{format(selectedDate, "dd MMMM yyyy")}</p>
          <p className='quantity-events'>{selectedOrders.length} Events</p>
        </div>

        <div className='calendar-status-list'>
          <div className='calendar-status-list new'>
            <p>New</p>
            <span>{countByStatus.new}</span>
          </div>
          <div className='calendar-status-list rescheduled'>
            <p>Rescheduled</p>
            <span>{countByStatus.rescheduled}</span>
          </div>
          <div className='calendar-status-list confirmed'>
            <p>Confirmed</p>
            <span>{countByStatus.confirm}</span>
          </div>
        </div>

        <div>Free time slots</div>
        <div className='calendar-orders-list'></div>
      </div>
      {selectedOrders.map((order, index) => {
        if (!order.customer || !order.customer.name || !order.customer.phone) {
          console.warn("⚠️ Пропущен ордер без customer:", order);
          return null;
        }

        if (!order.date || !order.status || !order.type) {
          console.warn("⚠️ Пропущен ордер с пустым полем:", order);
          return null;
        }

        return (
          <ManagerOrder
            key={index}
            status={order.status}
            date={order.date}
            type={order.type}
            customer={order.customer}
            onDelete={() => {
              setSelectedOrder(order);
              setPopupVisible(true);
            }}
            onReschedule={() =>
              navigate(`/reschedule/${order.id}`, {
                state: {
                  selectedDate: order.date,
                  orderId: order.id,
                },
              })
            }
          />
        );
      })}
      <DeleteReasonPopup
        visible={popupVisible}
        reason={deleteReason}
        setReason={setDeleteReason}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
