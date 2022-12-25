//firebase
import { db } from "../config/firebaseConfig";
import { ref, set } from "firebase/database";
import { v4 } from "uuid";

const writeProfileData = async (activeUser, fullName) => {
  const { name, image, email, userName, uid } = activeUser;
  const newUser = {
    name: name || fullName,
    userName,
    avatar: image,
    email,
    uid,
    bio: "",
    website: "",
    posts: [],
    followers: [],
    following: [],
    likedPosts: [],
    bookmarkPosts: [],
    id: v4(),
  };

  const profileRef = ref(db, `users/${userName}`);

  try {
    await set(profileRef, newUser);
  } catch (err) {
    console.log(err);
  }
};

export default writeProfileData;
