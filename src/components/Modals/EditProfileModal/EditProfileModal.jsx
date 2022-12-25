import { useState } from "react";

//css
import "./EditProfileModal.css";
import "../Modals.css";

//icons
import { FaTimes } from "react-icons/fa";
import { AiFillCamera } from "react-icons/ai";

//firebase
import { db } from "../../../config/firebaseConfig";
import { ref, set } from "firebase/database";

import { useClickOutside } from "../../../custom-hooks";
import { uploadImage } from "../../../utils";

import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../features";

const EditProfile = ({ profile, modalClose }) => {
  const dispatch = useDispatch();
  const { allPosts } = useSelector((state) => state.posts);
  const [imgUrl, setImgUrl] = useState(profile.avatar);
  const [downloadImgUrl, setDownloadImgUrl] = useState(null);
  const [userInput, setUserInput] = useState({
    website: profile.website || "",
    bio: profile.bio || "",
  });

  //custom-hook for closing modal
  const nodeRef = useClickOutside(() => modalClose());

  //take user input
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };

  //upload img to firebase storage
  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    setImgUrl(URL.createObjectURL(file));

    //upload
    uploadImage(
      file,
      "avatarImages",
      () => dispatch(setLoading(true)),
      () => dispatch(setLoading(false)),
      (url) => setDownloadImgUrl(url)
    );
  };

  //update profile in the db
  const updateHandler = async () => {
    const { website, bio } = userInput;
    const newAvatar = downloadImgUrl || profile.avatar;

    // updating in posts
    const updatedAllPosts = allPosts?.map((post) => ({
      ...post,
      creator:
        post?.creator?.userName === profile.userName
          ? { ...post.creator, avatar: newAvatar }
          : post.creator,
      comments: post?.comments?.map((comment) => ({
        ...comment,
        user:
          comment?.user?.userName === profile?.userName
            ? { ...comment.user, avatar: newAvatar }
            : comment,
      })),
    }));

    console.log(updatedAllPosts);

    //updating in user's profile
    const updatedProfile = {
      ...profile,
      website,
      bio,
      avatar: newAvatar,
    };

    const profileDbRef = ref(db, `users/${profile.userName}`);
    const postsDbRef = ref(db, `allPosts`);

    try {
      await set(profileDbRef, updatedProfile);
      await set(postsDbRef, updatedAllPosts);
    } catch (err) {
      console.log(err);
    }

    modalClose();
  };

  return (
    <div className="modal-wrapper">
      <div className="modal" ref={nodeRef}>
        <div className="flex jc-space-b">
          <h3 className="modal-title">Edit Profile</h3>
          <div className="modal-close-btn" onClick={modalClose}>
            <FaTimes />
          </div>
        </div>
        <div className="modal-body">
          <div className="input-container">
            <label htmlFor="avatar">Avatar</label>
            <div className="modal-avatar">
              {imgUrl ? (
                <img src={imgUrl} alt="modal-avatar-img" />
              ) : (
                <h4 className="avatar-text">
                  {profile?.name?.slice(0, 1).toUpperCase()}
                </h4>
              )}
              <div className="modal-avatar-upload">
                <input
                  type="file"
                  id="avatar"
                  onChange={(e) => uploadHandler(e)}
                />
                <AiFillCamera className="modal-avatar-upload-icon" />
              </div>
            </div>
          </div>
          <div className="input-wrapper input-container">
            <label htmlFor="url">Website</label>
            <input
              type="text"
              id="url"
              name="website"
              value={userInput.website}
              placeholder="add a website"
              className="modal-input"
              onChange={(e) => changeHandler(e)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={userInput.bio}
              placeholder="add a bio"
              className="modal-textarea modal-bio-textarea"
              onChange={(e) => changeHandler(e)}
            ></textarea>
          </div>
        </div>
        <div className="modal-btns">
          <button className="btn btn-secondary mr-s" onClick={modalClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={updateHandler}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
