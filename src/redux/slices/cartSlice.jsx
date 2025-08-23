// redux/slices/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    bookedTests: [],
  },
  reducers: {
    addTestToCart: (state, action) => {
      state.bookedTests.push(action.payload);
    },
    removeTestFromCart: (state, action) => {
      state.bookedTests = state.bookedTests.filter(
        (test) => test.id !== action.payload
      );
    },
    removeBookedTests: (state) => {
      state.bookedTests = [];
    },
  },
});

export const { addTestToCart, removeTestFromCart, removeBookedTests } = cartSlice.actions;
export default cartSlice.reducer;
