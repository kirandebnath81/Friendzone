import { configureStore } from "@reduxjs/toolkit";

import {
  usersReducer,
  postsReducer,
  loadingReducer,
  themeReducer,
} from "./features";

const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    loading: loadingReducer,
    theme: themeReducer,
  },
});

export default store;
