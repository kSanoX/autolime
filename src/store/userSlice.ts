// src/store/userSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "manager" | "customer";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  sex: "male" | "female" | null;
  dateOfBirth: Date | null;
  phone: string;
  email: string;
  emailVerified: boolean;
  role: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserState {
  role: UserRole | null;
  data: User | null;
}

const initialState: UserState = {
  role: null,
  data: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
  },
});

export const { setRole, setUser } = userSlice.actions;
export default userSlice.reducer;
