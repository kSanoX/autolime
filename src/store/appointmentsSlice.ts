import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Appointment = {
  branchId: string;
  branchName: string;
  branchAddress: string;
  date: string;
  time: string;
  type: string;
};


// 🔄 Загрузка из localStorage
const stored = localStorage.getItem("appointments");
const parsed = stored ? (JSON.parse(stored) as Appointment[]) : [];

// 🧼 Начальное состояние
const initialState = {
  appointments: parsed,
};

// 💾 Сохранение в localStorage
function save(appointments: Appointment[]) {
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

export const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
      save(state.appointments);
    },
    removeAppointment: (
      state,
      action: PayloadAction<{ date: string; time: string }>
    ) => {
      state.appointments = state.appointments.filter(
        (a) => !(a.date === action.payload.date && a.time === action.payload.time)
      );
      save(state.appointments);
    },
    clearAppointments: (state) => {
      state.appointments = [];
      save(state.appointments);
    },
  },
});

export const { addAppointment, removeAppointment, clearAppointments } =
  appointmentsSlice.actions;
export default appointmentsSlice.reducer;
