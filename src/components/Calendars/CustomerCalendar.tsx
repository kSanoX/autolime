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
  parseISO,
} from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@/store";
import "../../styles/customer_styles/customer-calendar.scss";
import Header from "../Header";
import { removeAppointment } from "@/store/appointmentsSlice";
import { useLoadAppointmentsFromBackend } from "@/hooks/useLoadAppointmentsFromBackend";
import { customFetch } from "@/utils/customFetch";


type Appointment = {
    id: number;
    branchId: string;
    branchName: string;
    branchAddress: string;
    date: string;
    time: string;
    type: string;
  };

export default function WashAppointmentsCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const dispatch = useDispatch();
  useLoadAppointmentsFromBackend();

 

  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const appointmentsByDay = new Map<string, number>();
  appointments.forEach((a) => {
    const date = parseISO(a.date);
    const key = date.toDateString();
    appointmentsByDay.set(key, (appointmentsByDay.get(key) || 0) + 1);
  });

  const selectedAppointments = appointments.filter((a) =>
    isSameDay(parseISO(a.date), selectedDate)
  );

  const handleDeleteClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setPopupVisible(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedAppointment) return;
  
    try {
      const token = localStorage.getItem("access_token");
      const response = await customFetch(
        `${import.meta.env.VITE_API_URL}/appointments/${selectedAppointment.id}/remove`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }
  
      dispatch(removeAppointment({ date: selectedAppointment.date, time: selectedAppointment.time }));
    } catch (err) {
      console.error("Error deleting appointment:", err);
    } finally {
      setPopupVisible(false);
      setSelectedAppointment(null);
    }
  };
  
  
  const handleCancelDelete = () => {
    setPopupVisible(false);
    setSelectedAppointment(null);
  };
  

  return (
    <div>
        <Header logoVariant="calendar"/>
    <div className="wash-calendar">
      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          &lt;
        </button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          &gt;
        </button>
      </div>

      <div className="calendar-grid-wrapper">
        <div className="calendar-daynames">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="calendar-dayname">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const key = day.toDateString();
            const hasAppointments = appointmentsByDay.has(key);

            return (
              <div
                key={day.toISOString()}
                className={`calendar-cell${isSelected ? " selected" : ""}`}
                onClick={() => setSelectedDate(day)}
              >
                <div>{format(day, "d")}</div>
                {hasAppointments && <div className="dot" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="appointments-panel">
        {selectedAppointments.length === 0 ? (
          <p className="no-events">No appointments</p>
        ) : (
          selectedAppointments.map((a, i) => (
            <div key={i} className="appointment-card">
              <p className="appointment-date-time">
                {format(parseISO(a.date), "dd MMMM yyyy")} ·
                {a.time}
              </p>
              <p className="appointment-branch">{a.branchName}</p>
              <p className="appointment-address">{a.branchAddress}</p>
              <div className="functional-block-caledar">
              <button onClick={() => handleDeleteClick(a)}>
  <img src="../../src/assets/icons/trash-icon.svg" alt="delete" />
</button>
            <button><img src="../../src/assets/icons/ManagerOrder/call_icon.svg" alt="" /></button>
            <button><img src="../../src/assets/icons/path-icon.svg" alt="" /></button>
            <button><img src="../../src/assets/icons/qr-icon-yellow.svg" alt="" /></button>
        </div>
            </div>
          ))
        )}
      </div>
    </div>
    {popupVisible && (
  <div className="delete-popup-backdrop">
    <div className="delete-popup">
      <h3>Cancel appointment</h3>
      <p>Do you really want to cancel this appointment?</p>
      <div className="popup-actions">
        <button onClick={handleCancelDelete}>Cancel</button>
        <button onClick={handleConfirmDelete}>Delete</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
