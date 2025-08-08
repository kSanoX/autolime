import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Car = {
  brand: string;
  model: string;
  plate: string;
};

// 🔄 Загрузка из localStorage
const storedCars = localStorage.getItem("cars");
const parsedCars = storedCars ? JSON.parse(storedCars) as Car[] : [];

// 🧼 Начальное состояние
const initialState = {
  brand: "",
  model: "",
  plate: "",
  cars: parsedCars,
};

// 💾 Сохранение в localStorage
function saveToLocalStorage(cars: Car[]) {
  localStorage.setItem("cars", JSON.stringify(cars));
}

export const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    setBrand: (state, action: PayloadAction<string>) => {
      state.brand = action.payload;
      state.model = "";
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    addCar: (state, action: PayloadAction<Car>) => {
      state.cars.push(action.payload);
      saveToLocalStorage(state.cars);
    },
    updateCar: (
      state,
      action: PayloadAction<{ oldPlate: string; brand: string; model: string; plate: string }>
    ) => {
      const { oldPlate, brand, model, plate } = action.payload;
      const index = state.cars.findIndex(c => c.plate === oldPlate);
      if (index !== -1) {
        state.cars[index] = { brand, model, plate };
        saveToLocalStorage(state.cars);
      }
    },
    removeCar: (state, action: PayloadAction<string>) => {
      state.cars = state.cars.filter(car => car.plate !== action.payload);
      saveToLocalStorage(state.cars);
    },
  },
});

export const { setBrand, setModel, addCar, updateCar, removeCar } = carSlice.actions;
export default carSlice.reducer;
