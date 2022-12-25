import { ref, set } from "firebase/database";
import { toast } from "react-toastify";
import { db } from "../config/firebaseConfig";

const handlePostLike = async (allPosts, post, userProfile, type) => {
  // updating in allPosts database
  let updatedAllPosts;
  if (type === "like") {
    updatedAllPosts = allPosts?.map((userPost) =>
      userPost?.id === post?.id
        ? {
            ...userPost,
            likeCount: userPost?.likeCount + 1,
            likedby: userPost?.likedby || post?.creator?.userName,
          }
        : userPost
    );
  } else {
    updatedAllPosts = allPosts?.map((userPost) =>
      userPost?.id === post?.id
        ? {
            ...userPost,
            likeCount: userPost?.likeCount - 1,
            likedby: userPost?.likeCount === 1 ? "" : userPost.likedby,
          }
        : userPost
    );
  }

  // updating in user database
  let updatedUserProfile;
  if (type === "like") {
    updatedUserProfile = {
      ...userProfile,
      likedPosts: userProfile?.likedPosts
        ? [post, ...userProfile?.likedPosts]
        : [post],
    };
  } else {
    updatedUserProfile = {
      ...userProfile,
      likedPosts: userProfile?.likedPosts?.filter(
        (likedPost) => likedPost.id !== post.id
      ),
    };
  }

  try {
    const allPostsDatabaseRef = ref(db, "allPosts");
    const userProfileDatabaseRef = ref(db, `users/${userProfile?.userName}`);

    await set(allPostsDatabaseRef, updatedAllPosts);
    await set(userProfileDatabaseRef, updatedUserProfile);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};

export default handlePostLike;
