import { createSlice } from "@reduxjs/toolkit";

export const loadingReducer = createSlice({
  name: "loading",
  initialState: {
    loading: false,
  },
  reducers: {
    handleSetLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleSetLoading } = loadingReducer.actions;

export default loadingReducer.reducer;
