import { useState } from "react";

import "../Navbar.css";
import "./TopNavbar.css";

import { AiOutlinePlusCircle } from "react-icons/ai";

import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";

import { CreatePost } from "../../components";

//Nav Items
import navItems from "../navItemsData";

const TopNavbar = () => {
  const { activeUser, allUsers } = useSelector((state) => state.users);
  const [isCreatePostModal, setIsCreatePostModal] = useState(false);

  const userProfile = allUsers && allUsers[activeUser?.userName];

  //close create post modal
  const modalHandler = () => {
    setIsCreatePostModal(false);
  };

  //get user profile logo
  const getProfileLogo = () => {
    if (userProfile) {
      if (userProfile.avatar) {
        return <img src={userProfile?.avatar} alt="profile_image" />;
      } else {
        return <h4>{userProfile.name?.slice(0, 1).toUpperCase()}</h4>;
      }
    } else {
      return <h4>{activeUser.name?.slice(0, 1).toUpperCase()}</h4>;
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
            <span className="primary-text-color ">Friend</span>zone
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
