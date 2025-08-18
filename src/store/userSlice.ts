import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "manager" | "customer";

const initialState = {
  role: null as UserRole | null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },    
  },
});

export const { setRole } = userSlice.actions;
export default userSlice.reducer;
