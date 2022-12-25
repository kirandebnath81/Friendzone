import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allUsers: [],
  activeUser: {},
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setActiveUser: (state, { payload }) => {
      state.activeUser = payload;
    },
    setAllUsers: (state, { payload }) => {
      state.allUsers = payload;
    },
  },
});

export const { setActiveUser, setAllUsers } = usersSlice.actions;
export default usersSlice.reducer;
