import {createSlice} from '@reduxjs/toolkit';

const onboardingSlice = createSlice({
  name: 'onboarding', // This name will now match your slice
  initialState: {typeOfLogin: 'Doctor', otpVerifyToken: ''}, // Default value is "Doctor"
  reducers: {
    setTypeOfLogin: (state, action) => {
      state.typeOfLogin = action.payload; // Updates state with selected login type
    },
    setOtpVeriyToken: (state, action) => {
      state.otpVerifyToken = action.payload; // Updates state with selected login type
    },
  },
});

export const {setTypeOfLogin, setOtpVeriyToken} = onboardingSlice.actions;
export default onboardingSlice.reducer;
