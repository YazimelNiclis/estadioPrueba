// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "@/store/slices/map/mapSlice";

const store = configureStore({
  reducer: {
    map: mapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
