import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allPosts: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setAllPosts: (state, { payload }) => {
      state.allPosts = payload;
    },
    toggleDropdownMenu: (state, { payload }) => {
      state.allPosts = state.allPosts.map((post) =>
        post.id === payload.id
          ? { ...post, isDropdown: payload.value }
          : { ...post, isDropdown: false }
      );
    },
    toggleCommentView: (state, { payload }) => {
      state.allPosts = state.allPosts.map((post) =>
        post.id === payload.id
          ? { ...post, isCommentView: payload.value }
          : { ...post, isCommentView: false }
      );
    },
    toggleCommentDropdown: (state, { payload }) => {
      const { postId, commentId, value, type } = payload;
      console.log("I got you");

      if (type === "clickoutside") {
        state.allPosts = state.allPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post?.comments?.map((comment) => ({
                  ...comment,
                  isDropdown: false,
                })),
              }
            : post
        );
      } else {
        state.allPosts = state.allPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post?.comments?.map((comment) =>
                  comment.id === commentId
                    ? { ...comment, isDropdown: value }
                    : { ...comment, isDropdown: false }
                ),
              }
            : post
        );
      }
    },
  },
});

export const {
  setAllPosts,
  toggleDropdownMenu,
  toggleCommentView,
  toggleCommentDropdown,
} = postsSlice.actions;
export default postsSlice.reducer;
