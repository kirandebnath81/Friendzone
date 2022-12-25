//firebase
import { ref, set } from "firebase/database";
import { db } from "../config/firebaseConfig";

const setFollowing = async (profile, givenUser, type) => {
  let newProfile = "";
  if (type === "inc") {
    if (profile.following) {
      newProfile = {
        ...profile,
        following: [...profile.following, givenUser],
      };
    } else {
      newProfile = {
        ...profile,
        following: [givenUser],
      };
    }
  } else {
    newProfile = {
      ...profile,
      following: profile.following.filter((user) => user !== givenUser),
    };
  }

  const userName = profile.email.split("@")[0];

  const profileRef = ref(db, `users/${userName}`);
  try {
    await set(profileRef, newProfile);
  } catch (err) {
    console.log(err);
  }
};

export default setFollowing;
