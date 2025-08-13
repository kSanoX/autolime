import { createSlice,  type PayloadAction } from "@reduxjs/toolkit";

export type Brand = {
  id: number;
  name: string;
};
export type Model = { id: number; name: string };
export type Car = { brand: Brand; model: Model; plate: string };
export type CarPreview = {
  plate: string;
};


const initialState: {
  brand: Brand | null;
  model: Model | null;
  cars: Car[];
} = {
  brand: null,
  model: null,
  cars: [],
};

export const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    setBrand: (state, action: PayloadAction<Brand | null>) => {
      state.brand = action.payload;
      state.model = null;
    },
    setModel: (state, action: PayloadAction<Model | null>) => {
      state.model = action.payload;
    },
    addCar: (state, action: PayloadAction<Car>) => {
      state.cars.push(action.payload);
    },
    updateCar: (
      state,
      action: PayloadAction<{
        oldPlate: string;
        brand: Brand;
        model: Model;
        plate: string;
      }>
    ) => {
      const { oldPlate, brand, model, plate } = action.payload;
      const index = state.cars.findIndex((c) => c.plate === oldPlate);
      if (index !== -1) {
        state.cars[index] = { brand, model, plate };
      }
    },
    removeCar: (state, action: PayloadAction<string>) => {
      state.cars = state.cars.filter((car) => car.plate !== action.payload);
    },
    setCars: (state, action: PayloadAction<Car[]>) => {
      state.cars = action.payload;
    },
  }  
});

export const { setBrand, setModel, addCar, updateCar, removeCar, setCars} = carSlice.actions;
export default carSlice.reducer;

