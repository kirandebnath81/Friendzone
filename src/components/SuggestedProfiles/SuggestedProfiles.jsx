import "./SuggestedProfiles.css";

import { useSelector } from "react-redux";

import { setFollowers, setFollowing } from "../../utils";

import ProfileCard from "../ProfileCard/ProfileCard";

const SuggestedProfiles = () => {
  const { activeUser, allUsers } = useSelector((state) => state.users);

  const getProfiles = () => {
    let profiles = Object.values(allUsers);

    //removing the active profile
    profiles = profiles.filter(
      ({ userName }) => userName !== activeUser?.userName
    );

    const activeProfile = allUsers[activeUser.userName];

    if (activeProfile?.following) {
      profiles = profiles.filter(({ userName }) =>
        activeProfile.following.every((user) => user !== userName)
      );
    }

    if (profiles.length > 5) {
      return profiles.slice(0, 5);
    } else {
      return profiles;
    }
  };

  if (!getProfiles()) {
    return;
  }

  if (getProfiles().length === 0) {
    return;
  }

  const followHandler = (profile) => {
    //Increase follower in the followed user a/c
    setFollowers(profile, activeUser.userName, "inc");

    //increase following in the active user a/c
    const activeUserProfile = allUsers[activeUser.userName];
    setFollowing(activeUserProfile, profile?.userName, "inc");
  };

  return (
    <div className="suggested-profiles-wrapper">
      <div className="suggested-profiles-title">Suggested Profiles</div>
      <div>
        {getProfiles()?.map((profile) => (
          <ProfileCard
            key={profile?.id}
            profile={profile}
            type="suggest"
            handler={followHandler}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedProfiles;
