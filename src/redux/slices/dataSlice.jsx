// dataSlice.js (Redux)
import { createSlice } from '@reduxjs/toolkit';

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    homeData: [],
    appointmentData: [],
    historyData: [],
    articlesData: [],
    profileData: [],
  },
  reducers: {
    setHomeData: (state, action) => {
      state.homeData = action.payload;
    },
    setAppointmentData: (state, action) => {
      state.appointmentData = action.payload;
    },
    setHistoryData: (state, action) => {
      state.historyData = action.payload;
    },
    setArticlesData: (state, action) => {
      state.articlesData = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
  
    fetchData: (state, action) => {
     
      const tabName = action.payload;

      let data = [];

      switch (tabName) {
        case 'Home':
          data = ['Home data 1', 'Home data 2', 'Home data 3']; 
          break;
        case 'Appointment':
          data = ['Appointment data 1', 'Appointment data 2']; 
          break;
        case 'History':
          data = ['History data 1', 'History data 2']; 
          break;
        case 'Articles':
          data = ['Article 1', 'Article 2'];
          break;
        case 'Profile':
          data = ['Profile data 1', 'Profile data 2']; 
          break;
        default:
          break;
      }

      // Set the data in the Redux store based on the tab
      state[`${tabName.toLowerCase()}Data`] = data;
    },
  },
});

export const { setHomeData, setAppointmentData, setHistoryData, setArticlesData, setProfileData, fetchData } = dataSlice.actions;
export default dataSlice.reducer;
