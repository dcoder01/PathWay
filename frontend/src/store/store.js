import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from './jobSlice'
import scheduleSlice from './scheduleSlice'
const store = configureStore({
  reducer: {
   authSlice,
   jobSlice,
   scheduleSlice,
   
  },
});

export default store;