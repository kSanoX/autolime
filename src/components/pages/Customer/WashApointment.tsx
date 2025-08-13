import  { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@/store";
import { useCreateAppointment } from "@/hooks/useCreateAppointment";
import { useLoadAppointmentsFromBackend } from "@/hooks/useLoadAppointmentsFromBackend";

import { SingleCalendarMobileSheet } from "@/components/Calendars/SingleCalendarDropDownSheet";
import { TimePickerMobileSheet } from "@/components/ui/TimePickerMobileSheet";
import { TypeWashingDropDown } from "@/components/ui/TypeWashingDropDown";
import { BranchInfoPanel } from "./BranchInfoPanel";

type Service = {
  id: number;
  name: string;
};

export default function WashAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const branch = location.state?.branch;
  const appointments = useSelector((state: RootState) => state.appointments.appointments);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [pickedTime, setPickedTime] = useState("");
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAppointment, loading, error, success } = useCreateAppointment();
  useLoadAppointmentsFromBackend();
  

  const isFormValid = selectedDate && pickedTime && selectedService && branch;

  useEffect(() => {
    if (!branch) {
      navigate("/branches");
    }
  }, [branch, navigate]);

  const handleGoToMap = () => {
    if (branch) {
      navigate("/branches", {
        state: {
          selectedBranchId: branch.id,
          viewMode: "map",
        },
      });
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting || !branch || !selectedService || !selectedDate) return;
  
    setIsSubmitting(true);
  
    const formattedDate = selectedDate.toISOString().split("T")[0];
  
    await createAppointment({
      car_wash_id: branch.id,
      date: formattedDate,
      time: pickedTime,
      branchName: branch.name,
      branchAddress: branch.address,
      type: selectedService.name,
    });
  
    setSelectedDate(undefined);
    setPickedTime("");
    setSelectedService(null);
    setIsSubmitting(false);
  };  

  return (
    <div>
      <header>
        <img src='src/assets/icons/left-arrow.svg' alt='' />
        Branches
        <span></span>
      </header>

      

      <div className='wash-apointment-wrapper'>
        <BranchInfoPanel
          branch={branch}
          extraActions={
            <button onClick={handleGoToMap}>
              <img src='../../src/assets/icons/geo-icon-yellow.svg' alt='geo' />
            </button>
          }
        />

        {Array.isArray(appointments) && appointments.length > 0 && (
          <div className='appointment-summary-card'>
            <h3>My appointments</h3>
            {appointments.map((appointment, index) => (
              <div key={index} className='flexible-appointment-detail'>
                <div>
                  <div className='appointment-detail'>
                    <img
                      src='../../../src/assets/icons/branch/summary-calendar.svg'
                      alt='calendar'
                    />
                    <span>
                      {new Date(appointment.date).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                  <div className='appointment-detail'>
                    <img
                      src='src/assets/icons/car-wash-type-icon.svg'
                      alt='type'
                    />
                    <span>{appointment.type}</span>
                  </div>
                </div>
                <div>
                  <div className='appointment-detail'>
                    <img
                      src='../../../src/assets/icons/branch/summary-time.svg'
                      alt='clock'
                    />
                    <span>{appointment.time}</span>
                  </div>
                  <div className='appointment-detail'>
                    <img
                      src='../../../src/assets/icons/branch/summary-applied.svg'
                      alt='status'
                    />
                    <span>Applied</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='car-wash-apointment-display'>
          <h4>Сar wash appointment</h4>
          {success && <div className="booking-status">Booking success</div>}
          {error && <div className="booking-error">{error}</div>}

          <div className='form-group'>
            <label htmlFor='dob'>Date</label>
            <div className='input-select' onClick={() => setCalendarOpen(true)}>
              <input
                type='text'
                id='dob'
                placeholder='--/--/----'
                value={
                  selectedDate
                    ? selectedDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : ""
                }
                readOnly
              />
              <img src='src/assets/icons/left-arrow.svg' alt='Arrow' />
            </div>
          </div>

          <div className='input-block'>
            <label>Time</label>
            <div
              className='input-select'
              onClick={() => setTimePickerOpen(true)}
            >
              {pickedTime || "-- : --"}
              <img src='src/assets/icons/left-arrow.svg' alt='Arrow' />
            </div>
          </div>

          <div className='input-block'>
            <label>Service</label>
            <div className='input-select' onClick={() => setTypeOpen(true)}>
              {selectedService?.name || "-"}
              <img src='src/assets/icons/left-arrow.svg' alt='Arrow' />
            </div>
          </div>

          <button
            className={`submit-button ${isFormValid ? "active" : "disabled"}`}
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <div className='loader-spinner' />
            ) : (
              "Book a service"
            )}
          </button>
        </div>

        <SingleCalendarMobileSheet
          open={calendarOpen}
          setOpen={setCalendarOpen}
          applyDate={setSelectedDate}
          initialDate={selectedDate}
          title='Select date of birth'
        />

        <TimePickerMobileSheet
          open={timePickerOpen}
          setOpen={setTimePickerOpen}
          applyTime={(time) => setPickedTime(time)}
        />

        <TypeWashingDropDown
          open={typeOpen}
          setOpen={setTypeOpen}
          selectedServiceName={selectedService?.name || ""}
          applyType={(service: Service) => {
            setSelectedService(service);
            setTypeOpen(false);
          }}
        />
      </div>
    </div>
  );
}
