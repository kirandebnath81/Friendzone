import "../Pages.css";

import { useSelector } from "react-redux";

import { PostCard } from "../../components";

const Explore = () => {
  const { allPosts } = useSelector((state) => state.posts);
  return (
    <div className="main-wrapper">
      {allPosts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Explore;
