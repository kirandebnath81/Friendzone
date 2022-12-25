import { lazy, Suspense, useEffect } from "react";
import "./App.css";

//toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//router
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//firebase
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "./config/firebaseConfig";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveUser,
  setAllPosts,
  setAllUsers,
  setLoading,
} from "./features";

//components
import { TopNavbar, BottomNavbar } from "./layout";
import { SuggestedProfiles, Spinner } from "./components";

//importing the components dynamically
const Home = lazy(() => import("./pages/Home/Home"));
const Explore = lazy(() => import("./pages/Explore/Explore"));
const Bookmark = lazy(() => import("./pages/Bookmark/Bookmark"));
const Signin = lazy(() => import("./pages/Auth/Signin"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const Profile = lazy(() => import("./pages/Profile/Profile"));

function App() {
  const dispatch = useDispatch();
  const { activeUser } = useSelector((state) => state.users);
  const { isLoading } = useSelector((state) => state.loading);

  //get active user data
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setActiveUser({
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            uid: user.uid,
            userName: user.email.split("@")[0],
          })
        );
      } else {
        dispatch(setActiveUser(null));
      }
    });
  }, [dispatch]);

  // read data from db
  useEffect(() => {
    if (activeUser?.uid) {
      getData("users", setAllUsers, dispatch);
      getData("allPosts", setAllPosts, dispatch);
    }
  }, [activeUser, dispatch]);

  const getData = (folder, setData, dispatch) => {
    dispatch(setLoading(true));
    const usersRef = ref(db, folder);
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        dispatch(setData(data));
        dispatch(setLoading(false));
      } else {
        dispatch(setData([]));
        dispatch(setLoading(false));
      }
    });
  };

  return (
    <div className="app">
      {isLoading && <Spinner />}
      <ToastContainer
        position="bottom-left"
        autoClose={1500}
        pauseOnHover
        theme="light"
      />
      <Router>
        <TopNavbar />
        <BottomNavbar />
        <Suspense fallback=<Spinner />>
          <Routes>
            <Route
              path="/"
              element={
                activeUser ? <Home /> : <Navigate to={"/signin"} replace />
              }
            />

            <Route
              path="/explore"
              element={
                activeUser ? <Explore /> : <Navigate to={"/signin"} replace />
              }
            />

            <Route
              path="/bookmark"
              element={
                activeUser ? <Bookmark /> : <Navigate to={"/signin"} replace />
              }
            />

            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile/:userName"
              element={
                activeUser ? <Profile /> : <Navigate to={"/signin"} replace />
              }
            />
          </Routes>
        </Suspense>
        {activeUser && <SuggestedProfiles />}
      </Router>
    </div>
  );
}

export default App;
