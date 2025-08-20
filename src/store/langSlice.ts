import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LangState = {
  translations: Record<string, any>;
};

const initialState: LangState = {
  translations: {},
};

export const langSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setTranslations(state, action: PayloadAction<Record<string, any>>) {
      state.translations = action.payload;
    },
  },
});

export const { setTranslations } = langSlice.actions;
export default langSlice.reducer;