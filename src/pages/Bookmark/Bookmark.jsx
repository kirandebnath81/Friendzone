import "../Pages.css";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PostCard } from "../../components";

const Bookmark = () => {
  const navigate = useNavigate();
  const { activeUser, allUsers } = useSelector((state) => state.users);

  const bookmarkPosts = allUsers[activeUser?.userName]?.bookmarkPosts;

  if (!bookmarkPosts) {
    return (
      <div className="main-wrapper">
        <div className="fs-3">No posts added to bookmark</div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Add Some
        </button>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      {bookmarkPosts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Bookmark;
