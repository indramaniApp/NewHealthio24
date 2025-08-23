import { configureStore } from '@reduxjs/toolkit';
import onboardingSlice from '../redux/slices/onboardingSlice';
import loaderReducer from '../redux/slices/loaderSlice'; // Import loader slice

const store = configureStore({
  reducer: {
    onboarding: onboardingSlice,
    loader: loaderReducer, // Add loader reducer
  },
});

export default store;
