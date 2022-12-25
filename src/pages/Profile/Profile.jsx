import "./Profile.css";

import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

//firebase
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

import { setFollowers, setFollowing } from "../../utils";

import {
  DisplayUsersModal,
  EditProfileModal,
  PostCard,
} from "../../components";
import { useState } from "react";

const Profile = () => {
  const { userName } = useParams();
  const navigate = useNavigate();
  const { activeUser, allUsers } = useSelector((state) => state.users);
  const { allPosts } = useSelector((state) => state.posts);

  const [viewUsersModal, setViewUsersModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ title: "", users: [] });
  const [viewEditModal, setViewEditModal] = useState(false);

  const profile = allUsers && allUsers[userName];

  //handle signout
  const signoutHanler = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.log(error.message);
    }
  };

  //handle following
  const followHandler = () => {
    //Increase follower in the followed user a/c
    setFollowers(profile, activeUser.userName, "inc");

    //increase following in the active user a/c
    const activeUserProfile = allUsers[activeUser.userName];
    setFollowing(activeUserProfile, userName, "inc");
  };

  // handle unfollowing
  const unfollowHandler = () => {
    //Decrease follower in the followed user a/c
    setFollowers(profile, activeUser.userName, "dec");

    //Decrease following in the active user a/c
    const activeUserProfile = allUsers[activeUser.userName];
    setFollowing(activeUserProfile, userName, "dec");
  };

  //display specific users through modal
  const displayUsers = (type) => {
    setViewUsersModal(true);

    const standardTitle =
      type.slice(0, 1).toUpperCase() + type.slice(1, type.length).toLowerCase();

    if (profile[type]) {
      setModalInfo((prev) => ({
        ...prev,
        title: standardTitle,
        users: profile[type],
      }));
    } else {
      setModalInfo((prev) => ({
        ...prev,
        title: standardTitle,
        users: [],
      }));
    }
  };

  const closeUsersModal = () => {
    setViewUsersModal(false);
  };

  const closeEditModal = () => {
    setViewEditModal(false);
  };

  if (!profile) {
    return;
  }

  //posts created by user
  const profilePosts = allPosts.filter(
    (post) => post?.creator.userName === profile.userName
  );

  return (
    <>
      {viewUsersModal && (
        <DisplayUsersModal info={modalInfo} modalClose={closeUsersModal} />
      )}
      {viewEditModal && (
        <EditProfileModal profile={profile} modalClose={closeEditModal} />
      )}

      <div className="profile">
        <div className="profile-details">
          <div className="profile-avatar">
            {profile && profile.avatar ? (
              <img src={profile.avatar} alt="avatar_img" />
            ) : (
              <div className="avatar-text">
                {profile?.name?.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="profile-name m-xs m-x-0">{profile?.name}</h3>

          <div className="profile-userName fw-500 secondary-text-color">
            @{userName}
          </div>

          {/* Follow   or unfollow button */}
          {activeUser?.uid !== profile?.uid &&
            (profile?.followers?.find(
              (user) => user === activeUser?.userName
            ) ? (
              <button
                className="btn btn-primary btn-outline m-s m-x-0"
                onClick={unfollowHandler}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="btn btn-primary m-s m-x-0"
                onClick={followHandler}
              >
                Follow
              </button>
            ))}

          {/* Active user profile buttons */}
          {activeUser?.uid === profile?.uid && (
            <div className="m-s m-x-0">
              <button
                className="btn btn-primary mr-s"
                onClick={() => setViewEditModal(true)}
              >
                Edit Profile
              </button>
              <button className="btn btn-danger" onClick={signoutHanler}>
                Log out
              </button>
            </div>
          )}

          {profile?.bio && <div className="profile-bio">{profile?.bio}</div>}
          {profile?.website && (
            <a
              href={profile?.website}
              target="_blank"
              rel="noreferrer"
              className="profile-website"
            >
              {profile?.website}
            </a>
          )}
          <div className="profile-stats">
            <div className="stats-box">
              <span>{profile?.followers ? profile?.followers?.length : 0}</span>
              <span
                className="primary-text-color cursor stats-link"
                onClick={() => displayUsers("followers")}
              >
                Followers
              </span>
            </div>
            <div className="stats-box">
              <span>{profile?.posts ? profile?.posts?.length : 0}</span>
              <span>Posts</span>
            </div>
            <div className="stats-box">
              <span>{profile?.following ? profile?.following?.length : 0}</span>
              <span
                className="primary-text-color cursor stats-link"
                onClick={() => displayUsers("following")}
              >
                Following
              </span>
            </div>
          </div>
        </div>

        <h4 className="profile-posts-title">All Posts</h4>
        <div className="profile-posts">
          {profilePosts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
