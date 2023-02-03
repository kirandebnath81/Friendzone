import { useState } from "react";

//css
import "../Navbar.css";
import "./TopNavbar.css";

//icons
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsSun } from "react-icons/bs";
import { MdOutlineDarkMode } from "react-icons/md";

//redux
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../features";

//router
import { NavLink, Link } from "react-router-dom";

import { CreatePost } from "../../components";

//Nav Items data
import navItems from "../../data/navItems";

const TopNavbar = () => {
  const dispatch = useDispatch();
  const { activeUser, allUsers } = useSelector((state) => state.users);
  const { themeMode } = useSelector((state) => state.theme);
  const [isCreatePostModal, setIsCreatePostModal] = useState(false);

  const userProfile = allUsers && allUsers[activeUser?.userName];

  //close create post modal
  const modalHandler = () => {
    setIsCreatePostModal(false);
  };

  const getTextLogo = (name) => name && name.slice(0, 1).toUpperCase();

  //get user profile logo
  const getProfileLogo = () => {
    if (userProfile) {
      if (userProfile.avatar) {
        return <img src={userProfile?.avatar} alt="profile-avatar" />;
      } else {
        return <h4>{getTextLogo(userProfile?.name)}</h4>;
      }
    } else {
      return <h4>{getTextLogo(activeUser?.name)}</h4>;
    }
  };

  //toggle theme
  const themeHandler = () => {
    if (themeMode === "light") {
      dispatch(toggleTheme("dark"));
    } else {
      dispatch(toggleTheme("light"));
    }
  };

  return (
    <>
      {isCreatePostModal && (
        <CreatePost handleModal={modalHandler} type="create" />
      )}

      <nav className="navbar nav-top">
        <div className="brand">
          <Link to={"/"}>
            <span className="primary-text-color">Friend</span>zone
          </Link>
        </div>

        {activeUser && (
          <ul className="nav-items-list">
            <li
              className="nav-item"
              onClick={() => setIsCreatePostModal(true)}
              data-info="Create Post"
            >
              <AiOutlinePlusCircle />
            </li>

            {navItems.map(({ activeItem, inactiveItem, path, id }) => (
              <li key={id} className="nav-item large-screen">
                <NavLink
                  to={`${path}`}
                  children={({ isActive }) =>
                    isActive ? activeItem : inactiveItem
                  }
                ></NavLink>
              </li>
            ))}

            <li className="nav-item" onClick={themeHandler}>
              {themeMode === "light" ? <MdOutlineDarkMode /> : <BsSun />}
            </li>

            <li className="nav-item">
              <Link to={`/profile/${activeUser?.userName}`}>
                {getProfileLogo()}
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
};

export default TopNavbar;
