import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from '../components/Loader';
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomePosts from "../components/HomePosts";
import { URL } from "../url";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { user } = useContext(UserContext);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoader(true);
      try {
        const res = await axios.get(`${URL}/api/posts` ,{
          withCredentials: true,
        });
        setPosts(res.data.posts);
        // Extract categories from posts
        const allCategories = new Set();
        res?.data?.posts.forEach(post => { post.approved &&
          post.categories.forEach(category => allCategories.add(category));
        });
        setCategories(Array.from(allCategories));
        setLoader(false);
      } catch (err) {
        console.log(err);
        setLoader(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategories(prevSelected =>
      prevSelected.includes(category)
        ? prevSelected.filter(c => c !== category)
        : [...prevSelected, category]
    );
  };

  // Filter posts based on selected categories
  const filteredPosts = selectedCategories.length > 0
    ? posts.filter(post => selectedCategories.every(cat => post.categories.includes(cat)))
    : posts;

  return (
    <>
      <Navbar />
      <div className="flex flex-1 flex-col bg-slate-800 px-8 md:px-[200px] min-h-screen py-8">
        <div className="h-36"></div>
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-4xl flex items-center mt-4 justify-center space-x-4 mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`backdrop-filter backdrop-blur-lg bg-opacity-50 bg-black p-4  text-white font-semibold px-4 py-2 rounded-md focus:outline-none ${
                selectedCategories.includes(category) ? 'bg-green-500' : 'bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {loader ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.filter((post) => post.status === "approved").map((post) => (
            <Link to={user ? `/posts/post/${post._id}` : "/login"} key={post._id}>
              <HomePosts post={post} />
            </Link>
          ))
        ) : (
          <h3 className="text-center font-bold mt-16 text-white">No posts available</h3>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;
