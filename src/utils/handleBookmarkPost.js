import { toast } from "react-toastify";

//firebase
import { ref, set } from "firebase/database";
import { db } from "../config/firebaseConfig";

const handleBookmarkPost = async (allPosts, post, userProfile, type) => {
  let newProfile;
  if (type === "bookmark") {
    newProfile = {
      ...userProfile,
      bookmarkPosts: userProfile.bookmarkPosts
        ? [post, ...userProfile.bookmarkPosts]
        : [post],
    };
  } else {
    newProfile = {
      ...userProfile,
      bookmarkPosts: userProfile.bookmarkPosts?.filter(
        (bookmarkPost) => bookmarkPost.id !== post.id
      ),
    };
  }

  try {
    const databaseRef = ref(db, `users/${userProfile?.userName}`);
    await set(databaseRef, newProfile);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};

export default handleBookmarkPost;
