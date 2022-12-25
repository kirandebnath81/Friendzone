//firebase
import { ref, set } from "firebase/database";
import { db } from "../config/firebaseConfig";

const setFollowers = async (profile, givenFollower, type) => {
  let newProfile = "";

  if (type === "inc") {
    if (profile?.followers) {
      newProfile = {
        ...profile,
        followers: [...profile?.followers, givenFollower],
      };
    } else {
      newProfile = {
        ...profile,
        followers: [givenFollower],
      };
    }
  } else {
    newProfile = {
      ...profile,
      followers: profile?.followers.filter(
        (follower) => follower !== givenFollower
      ),
    };
  }

  const userName = profile?.email?.split("@")[0];

  const profileRef = ref(db, `users/${userName}`);
  try {
    await set(profileRef, newProfile);
  } catch (err) {
    console.log(err);
  }
};

export default setFollowers;
