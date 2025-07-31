import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type Status = 'Confirm' | 'Rescheduled' | 'Expired' | 'Deleted' | 'New'

interface Order {
  id: number
  status: Status
  date: string
}

const initialState: Order[] = [
  { id: 1, status: 'Expired',     date: '23 June 2023 · 17:00' },
  { id: 2, status: 'New',         date: '12 June 2023 · 17:00' },
  { id: 3, status: 'Rescheduled', date: '21 June 2023 · 17:00' },
  { id: 4, status: 'Rescheduled', date: '01 June 2023 · 17:00' },
  { id: 5, status: 'Deleted',     date: '07 June 2023 · 17:00' },
  { id: 6, status: 'Confirm',     date: '30 June 2023 · 17:00' },
]

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    deleteOrder(state, action: PayloadAction<number>) {
      const index = state.findIndex(order => order.id === action.payload)
      if (index !== -1) {
        state[index].status = 'Deleted'
      }
    },
    updateOrder(state, action: PayloadAction<{ id: number; date: string; status: Status }>) {
        const index = state.findIndex(order => order.id === action.payload.id)
        if (index !== -1) {
          state[index].date = action.payload.date
          state[index].status = action.payload.status
        }
      },
  },
})

export const { deleteOrder, updateOrder } = ordersSlice.actions
export default ordersSlice.reducer
