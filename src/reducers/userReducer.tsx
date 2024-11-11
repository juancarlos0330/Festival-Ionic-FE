import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import isEmpty from "../validation/is-empty";
import { UserListPropsType } from "../actions/types";

interface AuthStateType {
  users: UserListPropsType[];
}

const initialState: AuthStateType = {
  users: [],
};

export const userReducer = createSlice({
  name: "users",
  initialState,
  reducers: {
    handleSetUserList: (state, action: PayloadAction<UserListPropsType[]>) => {
      state.users = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleSetUserList } = userReducer.actions;

export default userReducer.reducer;
