import { toast } from "react-toastify";

//firebse
import { ref, set } from "firebase/database";
import { db } from "../config/firebaseConfig";

const editComment = async (
  allPosts,
  commentedPost,
  commentId,
  commentInput
) => {
  const updatedPosts = allPosts.map((post) =>
    post.id === commentedPost.id
      ? {
          ...post,
          isCommentView: false,
          comments: post.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, content: commentInput }
              : comment
          ),
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

export default editComment;
