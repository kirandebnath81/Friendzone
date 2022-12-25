import { useEffect } from "react";
//icon
import { FcGoogle } from "react-icons/fc";

//firebase
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { writeProfileData } from "../../../utils";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const { activeUser, allUsers } = useSelector((state) => state.users);

  useEffect(() => {
    if (activeUser?.uid) {
      const userEmail = activeUser?.email?.split("@")[0];

      if (allUsers[userEmail]) {
        navigate("/");
      } else {
        writeProfileData(activeUser);
        navigate("/");
      }
    }
  }, [activeUser, navigate, allUsers]);

  //google auth
  const clickHandler = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="m-x-0 ">
      <div className="fw-500 primary-text-color text-align-center m-x-0 m-s ">
        OR
      </div>
      <button
        className="btn btn-primary btn-outline auth-btn"
        style={{ marginBottom: "3rem" }}
        onClick={clickHandler}
      >
        <FcGoogle className="mr-s fs-4" /> Continue with Google
      </button>
    </div>
  );
};

export default GoogleAuth;
