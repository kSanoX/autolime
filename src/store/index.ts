import { configureStore } from '@reduxjs/toolkit'
import ordersReducer from './ordersSlice'
import userReducer from './userSlice'
import carReducer from './carSlice'
import appointmentsReducer from './appointmentsSlice'

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    user: userReducer,
    car: carReducer,
    appointments: appointmentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
