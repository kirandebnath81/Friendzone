import "./ProfileCard.css";

import { AiOutlineUserAdd } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ profile, type, handler }) => {
  const navigate = useNavigate();

  const navigateHandler = (userName) => {
    navigate(`/profile/${userName}`);

    if (type === "modal") {
      handler();
    }
  };

  return (
    <div className="profile-card">
      <div className="flex">
        <div
          className="profile-card-avatar mr-s cursor"
          onClick={() => navigateHandler(profile?.userName)}
        >
          {profile?.avatar ? (
            <img src={profile?.avatar} alt="avatar-img" />
          ) : (
            <h5 className="profile-card-text-avatar">
              {profile?.name?.slice(0, 1).toUpperCase()}
            </h5>
          )}
        </div>
        <div
          className="profile-card-details cursor"
          onClick={() => navigateHandler(profile?.userName)}
        >
          <div className="fw-500">{profile?.name}</div>
          <div className="profile-card-userName">@{profile?.userName}</div>
        </div>
      </div>

      {type === "suggest" && (
        <div
          className="profile-card-follow-btn"
          data-info="Follow"
          onClick={() => handler(profile)}
        >
          <AiOutlineUserAdd />
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
