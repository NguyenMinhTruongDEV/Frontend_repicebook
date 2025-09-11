import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
