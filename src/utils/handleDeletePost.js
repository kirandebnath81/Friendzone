import { toast } from "react-toastify";

//firebase
import { ref, set } from "firebase/database";
import { db } from "../config/firebaseConfig";

const handleDeletePost = async (allPosts, post, userProfile) => {
  // delete from allPosts database
  const newAllPosts = allPosts?.filter((userPost) => userPost?.id !== post?.id);

  // delete from user database
  const newUserProfile = {
    ...userProfile,
    posts: userProfile?.posts.filter((userPost) => userPost.id !== post.id),
  };

  try {
    const allPostsDatabaseRef = ref(db, "allPosts");
    const userProfileDatabaseRef = ref(db, `users/${userProfile?.userName}`);

    await set(allPostsDatabaseRef, newAllPosts);
    await set(userProfileDatabaseRef, newUserProfile);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};

export default handleDeletePost;
