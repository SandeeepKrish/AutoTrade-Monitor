import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  selected: null,
  status: "idle",
  error: null,
};

const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setStocks(state, action) {
      state.list = action.payload;
    },
    setSelectedStock(state, action) {
      state.selected = action.payload;
    },
    setStockStatus(state, action) {
      state.status = action.payload;
    },
    setStockError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setStocks, setSelectedStock, setStockStatus, setStockError } =
  stockSlice.actions;

export default stockSlice.reducer;
