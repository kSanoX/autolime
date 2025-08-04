import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Car = {
  brand: string;
  model: string;
  plate: string;
};

const initialState = {
  brand: "",
  model: "",
  plate: "",
  cars: [] as Car[],
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
    addCar: (state, action: PayloadAction<Car>) => {
      state.cars.push(action.payload);
    },

    updateCar: (state, action: PayloadAction<{ oldPlate: string; brand: string; model: string; plate: string }>) => {
      const { oldPlate, brand, model, plate } = action.payload;
      const index = state.cars.findIndex(c => c.plate === oldPlate);
      if (index !== -1) {
        state.cars[index] = { brand, model, plate };
      }
    },
    removeCar: (state, action: PayloadAction<string>) => {
      state.cars = state.cars.filter(car => car.plate !== action.payload);
    }        
  },
  
});

export const { setBrand, setModel, addCar, updateCar, removeCar } = carSlice.actions;
export default carSlice.reducer;
