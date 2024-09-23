import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCountryChanged: false, // Boolean state for tracking the change
};

const CountryChangedSlice = createSlice({
  name: "countrychanged",
  initialState,
  reducers: {
    setCountryChanged: (state, action) => {
      state.isCountryChanged = action.payload; // Update state with the boolean payload
    },
  },
});

export const { setCountryChanged } = CountryChangedSlice.actions;

export default CountryChangedSlice;
