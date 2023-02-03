import { useEffect, useState } from "react";

import "./Auth.css";

import images from "../../assets";

//firebase
import { auth } from "../../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { getInputErrorMsg, writeProfileData } from "../../utils";
import GoogleAuth from "./components/GoogleAuth";

const Signup = () => {
  const navigate = useNavigate();
  const { activeUser } = useSelector((state) => state.users);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isAuthError, setIsAuthError] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState(false);
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //scroll the page to top
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    if (activeUser !== null) {
      writeProfileData(activeUser, fullName);
      navigate("/");
    }
  }, [activeUser, fullName, navigate]);

  //signup with firebase auth
  const onSubmit = async (data) => {
    const { email, password, confirmPassword, name } = data;

    setFullName(name);

    if (password !== confirmPassword) {
      setIsAuthError(true);
      setAuthErrorMsg("Password does not match");
      return;
    }

    setIsLoading(true);
    setIsAuthError(false);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setIsAuthError(true);
      setAuthErrorMsg(error.message);
    } finally {
      setIsLoading(false);
      console.log("finally");
    }
  };

  //input error styling
  const inputErrorStyle = (type) => {
    return {
      boxShadow: errors[type] && "0px 0px 0px 1px red",
    };
  };

  return (
    <div className="auth-container">
      <div className="title">Create Your Account</div>
      {isAuthError && <div className="auth-error">{authErrorMsg}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-wrapper">
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="Name"
            style={inputErrorStyle("name")}
          />

          {errors.name && getInputErrorMsg("name", errors.name?.type)}
        </div>

        <div className="input-wrapper ">
          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
            style={inputErrorStyle("email")}
          />

          {errors.email && getInputErrorMsg("email", errors.name?.type)}
        </div>

        <div className="input-wrapper">
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            placeholder="Password"
            style={inputErrorStyle("password")}
          />

          {errors.password &&
            getInputErrorMsg("password", errors.password?.type)}
        </div>

        <div className="input-wrapper">
          <input
            type="password"
            {...register("confirmPassword", {
              required: true,
              minLength: 6,
            })}
            placeholder="Confirm Password"
            style={inputErrorStyle("confirmPassword")}
          />

          {errors.confirmPassword &&
            getInputErrorMsg("password", errors.confirmPassword?.type)}
        </div>

        <button
          className="btn btn-primary  auth-btn"
          style={{ marginTop: "3rem" }}
        >
          {isLoading ? (
            <img src={images.whiteLoader} alt="loader-gif" />
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <GoogleAuth />

      <div className="text-align-center">
        <span className="mr-s fw-500">Already have an account ?</span>
        <Link to={"/signin"} className="fw-600 primary-text-color">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Signup;
