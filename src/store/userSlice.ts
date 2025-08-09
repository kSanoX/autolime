import { createSlice } from "@reduxjs/toolkit";

export type UserRole = "manager" | "manager";

const initialState = {
  role: "manager" as UserRole, // временно хардкод
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = userSlice.actions;
export default userSlice.reducer;
