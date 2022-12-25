import { toast } from "react-toastify";

//firebse
import { ref, set } from "firebase/database";
import { db } from "../config/firebaseConfig";

const deleteComment = async (allPosts, commentedPost, commentId) => {
  const updatedPosts = allPosts.map((post) =>
    post.id === commentedPost.id
      ? {
          ...post,
          comments: post.comments.filter((comment) => comment.id !== commentId),
        }
      : post
  );

  const databaseRef = ref(db, "allPosts");

  try {
    await set(databaseRef, updatedPosts);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};

export default deleteComment;
