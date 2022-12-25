import { useState } from "react";

import "./PostCard.css";

//icons
import { FaHeart } from "react-icons/fa";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { TfiComment } from "react-icons/tfi";
import { SlHeart } from "react-icons/sl";
import { HiOutlineDotsVertical } from "react-icons/hi";

//redux
import { useDispatch, useSelector } from "react-redux";
import { toggleCommentView, toggleDropdownMenu } from "../../features";

//utils
import {
  handlePostLike,
  handleDeletePost,
  handleBookmarkPost,
} from "../../utils";

//components
import CreatePost from "../Modals/CreatePost/CreatePost";
import PostCardComments from "./components/PostCardComments";

import { useNavigate } from "react-router-dom";
import { useClickOutside } from "../../custom-hooks";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeUser, allUsers } = useSelector((state) => state.users);
  const { allPosts } = useSelector((state) => state.posts);

  const [toggleEditPostModal, setToggleEditPostModal] = useState(false);

  //custom-hook for closing menu
  const postMenuRef = useClickOutside(() =>
    dispatch(toggleDropdownMenu({ id: post?.id, value: false }))
  );

  //active user profile
  const userProfile = allUsers[activeUser?.userName];

  //handle like or undo like a post
  const likeHandler = () => {
    const likeBtn = (
      <div
        className="postCard-btn"
        onClick={() => handlePostLike(allPosts, post, userProfile, "like")}
      >
        <SlHeart />
      </div>
    );

    if (userProfile?.likedPosts) {
      if (userProfile.likedPosts?.find((userPost) => userPost.id === post.id)) {
        return (
          <div
            className="postCard-btn postCard-liked-btn"
            onClick={() => handlePostLike(allPosts, post, userProfile, "undo")}
          >
            <FaHeart />
          </div>
        );
      } else {
        return likeBtn;
      }
    } else {
      return likeBtn;
    }
  };

  //handle bookmark or undo bookmark
  const bookmarkHandler = () => {
    const bookmarkBtn = (
      <div
        className="postCard-btn"
        onClick={() =>
          handleBookmarkPost(allPosts, post, userProfile, "bookmark")
        }
      >
        <BsBookmark />
      </div>
    );

    if (userProfile?.bookmarkPosts) {
      if (
        userProfile.bookmarkPosts?.find((userPost) => userPost.id === post.id)
      ) {
        return (
          <div
            className="postCard-btn primary-text-color"
            onClick={() =>
              handleBookmarkPost(allPosts, post, userProfile, "undo")
            }
          >
            <BsFillBookmarkFill />
          </div>
        );
      } else {
        return bookmarkBtn;
      }
    } else {
      return bookmarkBtn;
    }
  };

  //close edit modal
  const modalHandler = () => {
    setToggleEditPostModal(false);
  };

  return (
    <>
      {toggleEditPostModal && (
        <CreatePost handleModal={modalHandler} type="edit" post={post} />
      )}
      <div className="postCard">
        <div className="postCard-header flex  ai-center jc-space-b">
          <div
            className="postCard-user-details"
            onClick={() => navigate(`/profile/${post?.creator?.userName}`)}
          >
            <div className="avatar postCard-avatar">
              {post?.creator?.avatar ? (
                <img src={post?.creator?.avatar} alt="avatar-profile" />
              ) : (
                <h5 className="postCard-avatar-text">
                  {post?.creator?.name?.slice(0, 1).toUpperCase()}
                </h5>
              )}
            </div>
            <div className="postCard-profile">
              <div className="postCard-name">{post?.creator?.name}</div>
              <div className="fw-500 secondary-text-color postCard-userName">
                @{post?.creator?.userName}
              </div>
            </div>
          </div>
          {/* dropdown menu starts */}
          {post?.creator?.userName === userProfile.userName && (
            <div>
              {post?.isDropdown ? (
                <div className="menu-wrapper" ref={postMenuRef}>
                  <div
                    className="menu-icon fs-3 cursor"
                    onClick={() =>
                      dispatch(
                        toggleDropdownMenu({ id: post?.id, value: false })
                      )
                    }
                  >
                    <HiOutlineDotsVertical />
                  </div>
                  <div className="menu">
                    <div
                      className="menu-item"
                      onClick={() => setToggleEditPostModal(true)}
                    >
                      Edit
                    </div>
                    <div
                      className="menu-item"
                      onClick={() =>
                        handleDeletePost(allPosts, post, userProfile)
                      }
                    >
                      Delete
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="menu-icon fs-3 cursor"
                  onClick={() =>
                    dispatch(toggleDropdownMenu({ id: post?.id, value: true }))
                  }
                >
                  <HiOutlineDotsVertical />
                </div>
              )}
            </div>
          )}
          {/* dropdown menu ends */}
        </div>
        <div className="postCard-body">
          <div className="postCard-text m-md-2 m-x-0">{post?.text}</div>
          {post?.image && (
            <div className="postCard-image m-md-2 m-x-0">
              <img src={post.image} alt="post-img" />
            </div>
          )}
        </div>
        <div className="postCard-details-container flex ">
          <div className="postCard-details flex ai-center">
            {likeHandler()}
            <div>{post?.likeCount}</div>
          </div>

          <div className="postCard-details flex ai-center">
            <div
              className="postCard-btn"
              onClick={() =>
                dispatch(
                  toggleCommentView({
                    id: post.id,
                    value: !post?.isCommentView,
                  })
                )
              }
            >
              <TfiComment />
            </div>
            <div>{post?.comments?.length || "0"}</div>
          </div>

          <div className="postCard-details flex ai-center">
            {bookmarkHandler()}
          </div>
        </div>
        {post.likeCount > 0 && (
          <div className="secondary-text-color">
            {post?.likeCount === 1 && `Liked by ${post?.likedby}`}
            {post?.likeCount === 2 && `Liked by ${post?.likedby} and 1 other`}
            {post?.likeCount > 2 &&
              `Liked by ${post?.likedby} and ${post?.likeCount - 1} others`}
          </div>
        )}

        {post?.isCommentView && (
          <PostCardComments commentedPost={post} userProfile={userProfile} />
        )}
      </div>
    </>
  );
};

export default PostCard;
