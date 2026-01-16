import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import stockReducer from "./stockSlice";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    stocks: stockReducer,
    cart: cartReducer,
  },
});

export default store;
