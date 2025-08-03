import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CarState {
  brand: string;
  model: string;
}

const initialState: CarState = {
  brand: "",
  model: "",
};

export const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    setBrand: (state, action: PayloadAction<string>) => {
      state.brand = action.payload;
      state.model = ""; // сброс модели при смене бренда
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
  },
});

export const { setBrand, setModel } = carSlice.actions;
export default carSlice.reducer;
