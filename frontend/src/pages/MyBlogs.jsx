import { Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { URL } from "../url";
import HomePosts from "../components/HomePosts";
import Loader from "../components/Loader";

const MyBlogs = () => {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("all");
  const userData = JSON.parse(localStorage.getItem("user"));

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/user/" + user._id || userData._id , {
        withCredentials: true,
      
      });
      setPosts(res.data);
      if (res.data.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  const filterPosts = () => {
    if (activeTab === "all") {
      return posts;
    } else {
      return posts.filter((post) => post.status === activeTab);
    }
  };

  return (
    <div className="bg-slate-800 h-auto">
      <Navbar />
      <div className="h-40"></div>
      <div className="flex flex-col justify-center items-center px-8 md:px-[200px] min-h-[80vh]">
        <div className="bg-slate-800 p-2 fixed z-40 top-16 flex justify-between items-center mt-8 mb-8 w-[80vw] rounded-lg ">
          <div className="text-2xl text-slate-300 font-extrabold">Your Blogs:</div>
          <div className="flex justify-center space-x-4 py-4 overflow-y-auto">
            {["all", "In Review", "pending", "approved", "rejected"].map(
              (status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    activeTab === status
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveTab(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
        {loader ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : !noResults ? (
          filterPosts().map((post) => (
            <Link
              to={user ? `/posts/post/${post._id}` : "/login"}
              key={post._id}
            >
              <HomePosts post={post} />
            </Link>
          ))
        ) : (
          <h3 className="text-center font-bold mt-16">No posts available</h3>
        )}
      </div>
      <div className="h-16"></div>
      <Footer />
    </div>
  );
};

export default MyBlogs;
