import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Appointment = {
  branchId: string;
  date: string;
  time: string;
  type: string;
};

const initialState: Appointment[] = [];

export const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.push(action.payload);
    },
  },
});

export const { addAppointment } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
