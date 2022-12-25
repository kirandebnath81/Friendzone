//user
export { default as usersReducer } from "./users/usersSlice";
export { setActiveUser, setAllUsers } from "./users/usersSlice";

//posts
export { default as postsReducer } from "./posts/postsSlice";
export {
  setAllPosts,
  toggleDropdownMenu,
  toggleCommentView,
  toggleCommentDropdown,
} from "./posts/postsSlice";

//loading
export { default as loadingReducer } from "./loading/loadingSlice";
export { setLoading } from "./loading/loadingSlice";
