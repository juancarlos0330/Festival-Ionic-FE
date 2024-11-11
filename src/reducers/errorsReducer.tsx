import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ErrorDataType } from "../actions/types";

const initialState: ErrorDataType = {
  username: "",
  email: "",
  password: "",
  password2: "",
};

export const errorsReducer = createSlice({
  name: "errors",
  initialState,
  reducers: {
    handleSetErrors: (state, action: PayloadAction<ErrorDataType>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.password2 = action.payload.password2;
    },
    handleClearErrors: (state) => {
      state.username = "";
      state.email = "";
      state.password = "";
      state.password2 = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleClearErrors, handleSetErrors } = errorsReducer.actions;

export default errorsReducer.reducer;
