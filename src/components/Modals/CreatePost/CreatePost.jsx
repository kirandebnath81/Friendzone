import { useState } from "react";

//css
import "../Modals.css";
import "./CreatePost.css";

//icons
import { BsFillImageFill } from "react-icons/bs";
import { HiXMark } from "react-icons/hi2";
import { FaTimes } from "react-icons/fa";

import { v4 } from "uuid";
import { toast } from "react-toastify";

//firebase
import { ref, set } from "firebase/database";
import { db } from "../../../config/firebaseConfig";

//redux
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../features";

import { useClickOutside } from "../../../custom-hooks";
import { uploadImage } from "../../../utils";

const CreatePost = ({ handleModal, type, editedPost }) => {
  const dispatch = useDispatch();
  const { activeUser, allUsers } = useSelector((state) => state.users);
  const { allPosts } = useSelector((state) => state.posts);

  const [imageUrl, setImageUrl] = useState(editedPost?.image || null);
  const [text, setText] = useState(editedPost?.text || "");

  //close modal custom hook
  const nodeRef = useClickOutside(() => handleModal());

  //updating the post in the user's profile
  const userProfile = allUsers[activeUser?.userName];

  const uploadImageHandler = (e) => {
    const file = e.target.files[0];

    dispatch(setLoading(false));
    uploadImage(
      file,
      "postImages",
      () => dispatch(setLoading(true)),
      () => dispatch(setLoading(false)),
      (url) => setImageUrl(url)
    );
  };

  //upload post in the db
  const uploadPost = async () => {
    const user = allUsers[activeUser?.userName];
    const { name, userName, avatar } = user;
    // startLoading();
    const newPost = {
      text,
      image: imageUrl,
      likeCount: 0,
      likedby: "",
      comments: [],
      isCommentView: false,
      creator: {
        name,
        userName,
        avatar,
      },
      createdTime: new Date().getTime(),
      isDropdown: false,
      id: v4(),
    };

    let newProfile;
    if (userProfile?.posts) {
      newProfile = {
        ...userProfile,
        posts: [newPost, ...userProfile.posts],
      };
    } else {
      newProfile = { ...userProfile, posts: [newPost] };
    }

    try {
      //uploading in  the all posts database
      const postsDatabaseRef = ref(db, "allPosts");
      await set(postsDatabaseRef, [newPost, ...allPosts]);

      //updating in user's database
      const userDatabaseRef = ref(db, `users/${activeUser?.userName}`);
      await set(userDatabaseRef, newProfile);
      // stopLoading();
    } catch (error) {
      // stopLoading();
      console.log(error);
      toast.error("Something went wrong");
    }

    handleModal();
  };

  // save edited post in the db
  const editPost = async () => {
    let updatedAllPosts = allPosts?.map((userPost) =>
      userPost.id === editedPost.id
        ? { ...userPost, text, image: imageUrl }
        : userPost
    );

    let updatedUserPosts = {
      ...userProfile,
      posts: userProfile?.posts?.map((userPost) =>
        userPost.id === editedPost.id
          ? { ...userPost, text, image: imageUrl }
          : userPost
      ),
    };

    try {
      //uploading in  the all posts database
      const postsDatabaseRef = ref(db, "allPosts");
      await set(postsDatabaseRef, updatedAllPosts);

      //updating in user's database
      const userDatabaseRef = ref(db, `users/${activeUser?.userName}`);
      await set(userDatabaseRef, updatedUserPosts);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    handleModal();
  };

  return (
    <div className="modal-wrapper">
      <div className="modal" ref={nodeRef}>
        <div className="modal-header flex jc-space-b">
          <h3 className="modal-title">Create Post</h3>
          <div className="modal-close-btn" onClick={handleModal}>
            <FaTimes />
          </div>
        </div>

        <div className="modal-body">
          <textarea
            className="modal-textarea"
            value={text}
            placeholder="What's happening?"
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="modal-footer">
          <div className="upload-img">
            <label htmlFor="img" className="upload-icon">
              <BsFillImageFill />
            </label>
            <input
              type="file"
              id="img"
              style={{ display: "none" }}
              onChange={(e) => uploadImageHandler(e)}
            />
            {imageUrl && (
              <div className="preview-img">
                <span>Image</span>
                <HiXMark onClick={() => setImageUrl(null)} />
              </div>
            )}
          </div>

          <div className="modal-btns">
            <button className="btn btn-secondary mr-s" onClick={handleModal}>
              Cancel
            </button>
            {text ? (
              type === "create" ? (
                <button className="btn btn-primary" onClick={uploadPost}>
                  Create
                </button>
              ) : (
                <button className="btn btn-primary" onClick={editPost}>
                  Save
                </button>
              )
            ) : (
              <button
                className="btn btn-primary"
                disabled
                style={{ backgroundColor: "rgb(110, 112, 255)" }}
              >
                {type === "create" ? "Create" : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
