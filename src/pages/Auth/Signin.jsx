import { useEffect, useState } from "react";

import "./Auth.css";

import images from "../../assets";

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

//firebase
import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

import { getInputErrorMsg } from "../../utils";
import GoogleAuth from "./components/GoogleAuth";

const SignIn = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isAuthError, setIsAuthError] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState(false);
  const [isLoading, setIsLoading] = useState({ user: false, guest: false });

  //scroll the page to top
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  //sign in with firebase auth
  const signinHandler = async (email, password, type) => {
    setIsLoading((prev) => ({ ...prev, [type]: true }));
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthError(false);
      navigate("/");
    } catch (error) {
      setIsAuthError(true);
      setAuthErrorMsg(error.message);
    } finally {
      setIsLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  //noraml user sign in
  const onSubmit = (data) => {
    const { email, password } = data;
    signinHandler(email, password, "user");
  };

  // guest sign in
  const clickHandler = (email, password) => {
    signinHandler(email, password, "guest");
  };

  //input error style
  const inputErrorStyle = (type) => {
    return {
      boxShadow: errors[type] && "0px 0px 0px 1px red",
    };
  };

  return (
    <div className="auth-container">
      <h1 className="title">Sign In To Your Account</h1>
      {isAuthError && <div className="auth-error">{authErrorMsg}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Email"
            {...register("email", { required: true })}
            style={inputErrorStyle("email")}
          />

          {errors.email && getInputErrorMsg("email", errors.email?.type)}
        </div>

        <div className="input-wrapper">
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true, minLength: 6 })}
            style={inputErrorStyle("password")}
          />
          {errors.password && getInputErrorMsg("email", errors.password?.type)}
        </div>

        <button
          className="btn btn-primary  auth-btn "
          style={{ marginTop: "3rem" }}
        >
          {isLoading?.user ? (
            <img src={images.whiteLoader} alt="loader-gif" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>
      <GoogleAuth />

      <div
        className="test-login"
        onClick={() =>
          clickHandler("kirandebnath81@gmail.com", "#work#hard$%1")
        }
      >
        <span className="fw-600 cursor">Continue as a Guest</span>
        {isLoading?.guest && <img src={images.darkLoader} alt="loader-gif" />}
      </div>

      <div className="text-align-center">
        <span className="mr-s fw-500">Don't have an account ?</span>
        <Link to={"/signup"} className="fw-600 primary-text-color">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
