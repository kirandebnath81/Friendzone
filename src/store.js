import { configureStore } from "@reduxjs/toolkit";

import { usersReducer, postsReducer, loadingReducer } from "./features";

const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    loading: loadingReducer,
  },
});

export default store;
