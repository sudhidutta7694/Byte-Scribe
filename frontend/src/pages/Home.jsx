import axios from "axios";
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from '../components/Loader';
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomePosts from "../components/HomePosts";
import { URL } from "../url";

const Home = () => {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const { user } = useContext(UserContext);

  const POSTS_PER_PAGE = 3; // Number of posts to fetch per page

  // Fetch categories
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await axios.get(`${URL}/api/categories`);
  //       setCategories(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  const fetchPosts = useCallback(async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${URL}/api/posts?page=${page}&limit=${POSTS_PER_PAGE}&${search}`);
      const newPosts = res.data;
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setNoResults(newPosts.length === 0 && page === 1);
      setHasMore(newPosts.length === POSTS_PER_PAGE); // Check if the fetched posts are less than POSTS_PER_PAGE
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const lastPostElementRef = useCallback(node => {
    if (loader) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loader, hasMore]);

  // Handle category selection
  const handleCategorySelect = category => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prevSelected => prevSelected.filter(c => c !== category));
    } else {
      setSelectedCategories(prevSelected => [...prevSelected, category]);
    }
    // Reset page to 1 when selecting a new category
    setPage(1);
  };

  // Filter posts based on selected categories
  const filteredPosts = selectedCategories.length > 0 ? posts.filter(post => selectedCategories.includes(post.category)) : posts;

  return (
    <>
      <Navbar />
      <div className="flex flex-1 flex-col bg-slate-800 px-8 md:px-[200px] min-h-screen py-8">
        <div className="h-16"></div>
        <div className="flex justify-center space-x-4 mb-4">
          {fetchPosts.categories?.map(category => (
            <button
              key={category._id}
              onClick={() => handleCategorySelect(category)}
              className={`text-white font-semibold px-4 py-2 rounded-md focus:outline-none ${
                selectedCategories.includes(category) ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        {loader && page === 1 ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : !noResults ? (
          filteredPosts.filter((post) => post.status === "approved").map((post, index) => (
            <Link to={user ? `/posts/post/${post._id}` : "/login"} key={post._id}>
              <div ref={filteredPosts.length === index + 1 ? lastPostElementRef : null}>
                <HomePosts post={post} />
              </div>
            </Link>
          ))
        ) : (
          <h3 className="text-center font-bold mt-16 text-white">No posts available</h3>
        )}
      </div>
      {loader && page > 1 && (
        <div className="flex justify-center items-center py-4">
          <Loader />
        </div>
      )}
      <Footer />
    </>
  );
};

export default Home;
