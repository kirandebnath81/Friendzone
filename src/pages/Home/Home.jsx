import { useState } from "react";

import "./Home.css";
import "../Pages.css";

import { useSelector } from "react-redux";

import { PostCard, ProfileCard } from "../../components";

const Home = () => {
  const { allPosts } = useSelector((state) => state.posts);
  const { activeUser, allUsers } = useSelector((state) => state.users);

  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [sortValue, setSortValue] = useState("");

  function getReleventPosts() {
    const activeUserProfile = allUsers[activeUser?.userName];

    let relevetUsers = [activeUser.userName];

    if (activeUserProfile?.following) {
      relevetUsers = [...relevetUsers, ...activeUserProfile.following];
    }

    const releventPosts = allPosts.filter(({ creator }) =>
      relevetUsers.find((user) => user === creator.userName)
    );

    return releventPosts;
  }

  // handle sort posts
  const getSortedPosts = () => {
    const defaultPosts = getReleventPosts();

    if (sortValue === "new") {
      console.log("new");
      return defaultPosts.sort((a, b) => b.createdTime - a.createdTime);
    } else if (sortValue === "old") {
      console.log("old");
      return defaultPosts.sort((a, b) => a.createdTime - b.createdTime);
    } else {
      return defaultPosts;
    }
  };

  //handle user search
  const changeHandler = (e) => {
    const inputText = e.target.value;
    setSearchInput(inputText);

    if (!inputText) {
      setSearchResult("");
      return;
    }

    const allUsersList = Object.values(allUsers)?.filter(
      (user) => user.userName !== activeUser?.userName
    );

    const searchedUsers = allUsersList.filter((user) =>
      user.name.toLowerCase().includes(inputText.toLowerCase())
    );

    setSearchResult(searchedUsers);
  };

  return (
    <div className="main-wrapper">
      {/* Search users */}
      <div className="input-wrapper search-input-wrapper">
        <input
          type="text"
          value={searchInput}
          placeholder="Search user by name"
          onChange={(e) => changeHandler(e)}
        />
      </div>

      {searchResult.length !== 0 && (
        <div className="searched-users">
          {searchResult.map((user) => (
            <ProfileCard key={user.id} profile={user} type="search" />
          ))}
        </div>
      )}

      {allPosts.length === 0 ? (
        <div className="fw-500 secondary-text-color">
          Follow some users or Add a new post to see some feed here, or checkout
          the explore page.
        </div>
      ) : (
        <>
          {/* sort users */}
          <div className="sort-user-container">
            <select
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
            >
              <option value="">Default</option>
              <option value="new">Sort by Newest</option>
              <option value="old">Sort by Oldest</option>
            </select>
          </div>
          {/* show posts */}
          {getSortedPosts()?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </>
      )}
    </div>
  );
};

export default Home;
