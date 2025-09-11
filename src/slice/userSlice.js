import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null, // lưu thông tin user
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    },
    updateUser: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
  },
});

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
