import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import loadingReducer from "./loadingReducer";
import festivalReducer from "./festivalReducer";
import userReducer from "./userReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    errors: errorsReducer,
    loading: loadingReducer,
    festivals: festivalReducer,
    users: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
