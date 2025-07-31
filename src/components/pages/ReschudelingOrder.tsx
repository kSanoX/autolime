import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { format } from "date-fns"
import { updateOrder } from "../../store/ordersSlice"
import { SingleCalendarMobileSheet } from "../Calendars/SingleCalendarDropDownSheet"
import { TimePickerMobileSheet } from "../TimePickerMobileSheet"


export default function ReschudelingOrder() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { selectedDate, orderId } = location.state || {}

  const [datePart, setDatePart] = useState("")
  const [pickedTime, setPickedTime] = useState("")
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [timePickerOpen, setTimePickerOpen] = useState(false)

  const isSaveEnabled = selectedDateObj !== null && pickedTime !== ""

  useEffect(() => {
    if (selectedDate?.includes(" · ")) {
      const [dateStr] = selectedDate.split(" · ")
      const parsed = new Date(dateStr.trim())
      if (!isNaN(parsed.getTime())) {
        setDatePart(format(parsed, "d MMMM"))
        setSelectedDateObj(parsed)
      }
    }
  }, [selectedDate])

  const handleCalendarOpen = () => setCalendarOpen(true)
  const handleSave = () => {
    if (!orderId || !selectedDateObj || !pickedTime) return

    const formattedDate = format(selectedDateObj, "d MMMM yyyy") + " · " + pickedTime
    dispatch(updateOrder({ id: orderId, date: formattedDate, status: "Rescheduled" }))
    navigate(-1)
  }

  return (
    <div>
      <header className='rescheduling-header'>
        <button className='rescheduling-back-btn' onClick={() => navigate(-1)}>
          <img src='../../src/assets/icons/left-arrow.svg' alt='Back' />
        </button>
        <h2 className='rescheduling-title'>Rescheduling the order</h2>
      </header>
      <div className='rescheduling-order-container'>
        <div className='rescheduling-customer-info'>
          <div>
            <p className='rescheduling-customer-info-name'>Ivy Levan</p>
            <p className='rescheduling-customer-info-phone'>+995 500 777 777</p>
          </div>
          <div>
            <img src='../../src/assets/icons/ManagerOrder/Vector.svg' alt='' />
            <p className='rescheduling-washing-type'>Complex washing</p>
          </div>
        </div>

        <div className='rescheduling-customer-date-container'>
          <div className='rescheduling-date'>
            <p>Date</p>
            <div
              className='rescheduling-calendar-dropdown'
              onClick={handleCalendarOpen}
            >
              {datePart || "---"}
              <img src='../../src/assets/icons/left-arrow.svg' alt='' />
            </div>

            <SingleCalendarMobileSheet
              open={calendarOpen}
              setOpen={setCalendarOpen}
              initialDate={selectedDateObj}
              applyDate={(date) => {
                setDatePart(format(date, "d MMMM"));
                setSelectedDateObj(date);
                setCalendarOpen(false);
              }}
            />

            <p>Time</p>
            <div
              onClick={() => setTimePickerOpen(true)}
              className='rescheduling-time-date'
            >
              {pickedTime || "---"}
              <img src='../../src/assets/icons/left-arrow.svg' alt='' />
            </div>
          </div>
        </div>

        <div className='rescheduling-save-block'>
          <button
            disabled={!isSaveEnabled}
            className={`rescheduling-save-btn ${
              isSaveEnabled ? "active" : "inactive"
            }`}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>

      <TimePickerMobileSheet
        open={timePickerOpen}
        setOpen={setTimePickerOpen}
        applyTime={(time) => setPickedTime(time)}
      />
    </div>
  );
}
