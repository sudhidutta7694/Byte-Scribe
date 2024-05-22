import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL, IF } from "../url";
import { UserContext } from "../context/UserContext";
import {
  FaSearch,
  FaTrash,
  FaUserShield,
  FaUserAlt,
  FaBlog,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const url = "https://byte-scribe-backend.onrender.com";

  // Fetch user info on component mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }else if (user?.isAdmin === false) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const usersRes = await axios.get(URL + "/api/users");
        const postsRes = await axios.get(URL + "/api/posts");
        setUsers(usersRes.data);
        setPosts(postsRes.data);
        setFilteredUsers(usersRes.data);
        setFilteredPosts(postsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
    setFilteredPosts(filteredPosts);
  }, [searchTerm, users, posts]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedPost(null);
  };

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setSelectedUser(null);
  };

  const handleReviewPost = (postId) => {
    navigate(`/review/post/${postId}`);
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await axios.put(URL + `/api/users/${userId}/make-admin`);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isAdmin: true } : user
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(URL + `/api/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(url + "/api/auth/logout", {
        withCredentials: true,
      });
      console.log(res);
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-green-400">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="mb-6 flex justify-between">
          <div className="flex items-center mb-4">
            <FaUserAlt className="text-2xl mr-2" />
            <h2 className="text-2xl font-semibold">Users: {users.length}</h2>
          </div>
          <div className="flex items-center">
            <FaBlog className="text-2xl mr-2" />
            <h2 className="text-2xl font-semibold">
              Blogs Published: {posts.filter((post) => post.status === 'approved').length}
            </h2>
          </div>
        </div>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search users or blogs..."
            className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
            <ul className="bg-gray-800 rounded-lg p-4 overflow-y-auto h-64">
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center border-b border-gray-700 py-2 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSelectUser(user)}
                >
                  {user.username}
                  <div className="flex space-x-2">
                    {!user.isAdmin && (
                      <FaUserShield
                        className="text-green-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMakeAdmin(user._id);
                        }}
                      />
                    )}
                    {!user.isAdmin && (
                      <FaTrash
                        className="text-red-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user._id);
                        }}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Blog Posts in Review</h2>
            <ul className="bg-gray-800 rounded-lg p-4 overflow-y-auto h-64">
              {filteredPosts &&
                filteredPosts
                  .filter((post) => post.status === "in review")
                  .map((post) => (
                    <li
                      key={post._id}
                      className="border-b border-gray-700 py-2 cursor-pointer flex justify-between items-center"
                      onClick={() => handleSelectPost(post)}
                    >
                      <span className="flex items-center">
                        {post.photo && (
                          <img
                            src={IF + post.photo}
                            className="w-8 h-8 rounded-md mr-4"
                            alt={post.title}
                          />
                        )}
                        {post.title}
                      </span>
                      <button
                        className="bg-purple-500 text-white px-4 py-1 rounded-lg hover:bg-purple-600 ml-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewPost(post._id);
                        }}
                      >
                        Review
                      </button>
                    </li>
                  ))}
              {!filteredPosts.filter((post) => post.status === "in review").length && (
                <p className="text-center text-gray-400">No posts in review</p>
              )}
            </ul>
          </div>
        </div>
        {selectedUser && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">User Details</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Admin:</strong> {selectedUser.isAdmin ? "Yes" : "No"}
              </p>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">User Blogs</h3>
                <ul className="space-y-2 overflow-y-auto h-32">
                  {posts
                    .filter((post) => post.userId === selectedUser._id)
                    .map((post) => (
                      <li
                        key={post._id}
                        className="flex justify-between items-center bg-gray-700 rounded-lg p-4"
                      >
                        <img
                          src={IF + post.photo}
                          alt={post.title}
                          className="w-16 h-16 rounded-lg mr-4"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="text-sm text-gray-400">
                            {post.desc.substr(0, 80)}...
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              post.status === "approved"
                                ? "bg-green-500"
                                : post.status === "rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {post.status}
                          </span>
                          {post.status !== "rejected" && (
                            <button
                              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                              onClick={() => handleReviewPost(post._id)}
                            >
                              Review
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {selectedPost && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Blog Details</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">{selectedPost.title}</h3>
              <p className="mb-4">{selectedPost.content}</p>
              {selectedPost.photo && (
                <img
                  src={IF + selectedPost.photo}
                  alt={selectedPost.title}
                  className="w-full mx-auto mt-4 rounded-lg shadow-lg"
                />
              )}
              <p className="mt-4">
                <strong>Categories:</strong>{" "}
                {selectedPost.categories.map((c, i) => (
                  <span key={i} className="mr-2">#{c}</span>
                ))}
              </p>
              <p className="mt-4">
                <strong>Status:</strong> {selectedPost.status}
              </p>
              <div className="mt-4 flex items-center">
                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-purple-600"
                  onClick={() => handleReviewPost(selectedPost._id)}
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
