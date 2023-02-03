import "../Navbar.css";
import "./BottomNavbar.css";

//nav data
import navItems from "../../data/navItems";

import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const BottomNavbar = () => {
  const { activeUser } = useSelector((state) => state.users);

  if (!activeUser) {
    return;
  }

  return (
    <nav className="navbar nav-bottom">
      <ul className="nav-items-list">
        {navItems.map(({ activeItem, inactiveItem, path, id }) => (
          <li key={id} className="nav-item">
            <NavLink
              to={`${path}`}
              children={({ isActive }) =>
                isActive ? activeItem : inactiveItem
              }
            ></NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNavbar;
