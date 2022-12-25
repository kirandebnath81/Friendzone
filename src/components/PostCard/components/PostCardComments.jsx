import { useState } from "react";

import "./PostCardComment.css";

import { v4 } from "uuid";

import { toast } from "react-toastify";

import { HiOutlineDotsVertical } from "react-icons/hi";

//firebase
import { db } from "../../../config/firebaseConfig";
import { ref, set } from "firebase/database";

//redux
import { useDispatch, useSelector } from "react-redux";
import { toggleCommentDropdown } from "../../../features";

import { useClickOutside } from "../../../custom-hooks";

import { deleteComment, editComment } from "../../../utils";

const PostCardComments = ({ commentedPost, userProfile }) => {
  const dispatch = useDispatch();
  const { allPosts } = useSelector((state) => state.posts);
  const [commentInput, setCommentInput] = useState("");
  const [isCommentEdit, setIsCommentEdit] = useState(false);
  const [editedCommentId, setEditedCommentId] = useState(null);

  const nodeRef = useClickOutside(() => {
    dispatch(
      toggleCommentDropdown({
        postId: commentedPost?.id,
        value: false,
        type: "clickOutside",
      })
    );
  });

  //post comments
  const comments = commentedPost?.comments;

  //post comment in the db
  const postComment = async () => {
    if (!commentInput) return;

    const newComment = {
      user: {
        name: userProfile?.name,
        userName: userProfile?.userName,
        avatar: userProfile?.avatar,
      },
      content: commentInput,
      isDropdown: false,
      id: v4(),
    };

    const updatedPosts = allPosts.map((post) =>
      post.id === commentedPost.id
        ? {
            ...post,
            isCommentView: false,
            comments: post.comments
              ? [newComment, ...post.comments]
              : [newComment],
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
    setCommentInput("");
  };

  //edit comment
  const editHandler = (comment) => {
    setCommentInput(comment.content);
    setIsCommentEdit(true);
    setEditedCommentId(comment.id);
    dispatch(
      toggleCommentDropdown({
        postId: commentedPost?.id,
        commentId: comment?.id,
        value: false,
      })
    );
  };

  //save edited comment
  const saveEditComment = () => {
    editComment(allPosts, commentedPost, editedCommentId, commentInput);
    setCommentInput("");
    setIsCommentEdit(false);
    setEditedCommentId(null);
  };

  return (
    <div className="comments-container">
      <div className="input-wrapper comment-input-box flex ai-center">
        <input
          type="text"
          value={commentInput}
          placeholder="Add a comment"
          onChange={(e) => setCommentInput(e.target.value)}
        />

        {isCommentEdit ? (
          <div
            className={`comment-add-btn ${
              commentInput ? "comment-add-btn-normal" : "comment-add-btn-block"
            }`}
            onClick={saveEditComment}
          >
            Save
          </div>
        ) : (
          <div
            className={`comment-add-btn ${
              commentInput ? "comment-add-btn-normal" : "comment-add-btn-block"
            }`}
            onClick={postComment}
          >
            Post
          </div>
        )}
      </div>
      <div className="comments-wrapper">
        {comments &&
          comments?.map(
            (comment) =>
              comment.id !== editedCommentId && (
                <div key={comment?.id} className="flex jc-space-b ai-center">
                  <div className="comment-wrapper flex">
                    <div className="avatar comment-avatar">
                      <img src={comment?.user?.avatar} alt="avatar-profile" />
                    </div>
                    <div className="comment-details">
                      <div className="comment-creator-name">
                        {comment?.user?.name}
                      </div>
                      <div className="comment-posted-comment">
                        {comment?.content}
                      </div>
                    </div>
                  </div>

                  {/* dropdown menu starts */}
                  {comment?.user?.userName === userProfile?.userName && (
                    <div>
                      {comment?.isDropdown ? (
                        <div className="menu-wrapper" ref={nodeRef}>
                          <div
                            className="menu-icon fs-3 cursor comment-menu-icon"
                            onClick={() =>
                              dispatch(
                                toggleCommentDropdown({
                                  postId: commentedPost?.id,
                                  commentId: comment?.id,
                                  value: false,
                                })
                              )
                            }
                          >
                            <HiOutlineDotsVertical />
                          </div>
                          <div className="menu">
                            <div
                              className="menu-item"
                              onClick={() => editHandler(comment)}
                            >
                              Edit
                            </div>
                            <div
                              className="menu-item"
                              onClick={() =>
                                deleteComment(
                                  allPosts,
                                  commentedPost,
                                  comment.id
                                )
                              }
                            >
                              Delete
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="menu-icon fs-3 cursor comment-menu-icon"
                          onClick={() =>
                            dispatch(
                              toggleCommentDropdown({
                                postId: commentedPost?.id,
                                commentId: comment?.id,
                                value: true,
                              })
                            )
                          }
                        >
                          <HiOutlineDotsVertical />
                        </div>
                      )}
                    </div>
                  )}
                  {/* dropdown menu ends */}
                </div>
              )
          )}
      </div>
    </div>
  );
};

export default PostCardComments;
