import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import isEmpty from "../validation/is-empty";
import { ScheduleListPropsType } from "../actions/types";

interface ScheduleStateType {
  festivals: ScheduleListPropsType[];
}

const initialState: ScheduleStateType = {
  festivals: [],
};

export const festivalReducer = createSlice({
  name: "festival",
  initialState,
  reducers: {
    handleSetFestival: (
      state,
      action: PayloadAction<ScheduleListPropsType[]>
    ) => {
      state.festivals = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleSetFestival } = festivalReducer.actions;

export default festivalReducer.reducer;
