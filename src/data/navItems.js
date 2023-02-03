import { v4 } from "uuid";

//icons
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import {
  MdExplore,
  MdOutlineExplore,
  MdBookmark,
  MdBookmarkBorder,
} from "react-icons/md";

const navItems = [
  {
    activeItem: <AiFillHome />,
    inactiveItem: <AiOutlineHome />,
    path: "/",
    id: v4(),
  },
  {
    activeItem: <MdExplore />,
    inactiveItem: <MdOutlineExplore />,
    path: "/explore",
    id: v4(),
  },
  {
    activeItem: <MdBookmark />,
    inactiveItem: <MdBookmarkBorder />,
    path: "/bookmark",
    id: v4(),
  },
];

export default navItems;
