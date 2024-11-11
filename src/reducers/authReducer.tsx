import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import isEmpty from "../validation/is-empty";
import { AuthType } from "../actions/types";

interface AuthStateType {
  isAuthenticated: boolean;
  user: AuthType;
}

const initialState: AuthStateType = {
  isAuthenticated: false,
  user: {
    id: "",
    username: "",
    avatar: "",
    email: "",
    iat: 0,
    exp: 0,
  },
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleSetUser: (state, action: PayloadAction<AuthType>) => {
      state.isAuthenticated = !isEmpty(action.payload);
      state.user = action.payload;
    },
    handleClearUser: (state) => {
      state.isAuthenticated = false;
      state.user = {
        id: "",
        username: "",
        avatar: "",
        email: "",
        iat: 0,
        exp: 0,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleSetUser, handleClearUser } = authReducer.actions;

export default authReducer.reducer;
