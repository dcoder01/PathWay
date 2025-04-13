import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from './jobSlice'
import scheduleSlice from './scheduleSlice'
import companySlice from './companySlice'
import chatSlice from './chatSlice'
const store = configureStore({
  reducer: {
   authSlice,
   jobSlice,
   scheduleSlice,
   companySlice,
   chatSlice
   
  },
});

export default store;