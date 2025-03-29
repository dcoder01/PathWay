import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from './jobSlice'
import scheduleSlice from './scheduleSlice'
import companySlice from './companySlice'
const store = configureStore({
  reducer: {
   authSlice,
   jobSlice,
   scheduleSlice,
   companySlice,
   
  },
});

export default store;