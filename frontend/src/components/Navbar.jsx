import {
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch, BsPersonCircle } from "react-icons/bs";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Navbar = () => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const { user, setUser } = useContext(UserContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [updated, setUpdated] = useState(false);
  const profileMenuRef = useRef();
  const url = "http://localhost:8080";

  // Fetch user info on component mount

  const fetchProfile = async () => {
    try {
      const res = await axios.get(url + "/api/users/" + user._id);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPassword(res.data.password);
      // console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }else {
      navigate("/login");
    }
  }, [user]);
  
  // Close profile dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserUpdate = async () => {
    setUpdated(false);
    try {
      const res = await axios.put(
        url + "/api/users/" + user._id,
        { username, email, password },
        { withCredentials: true }
      );
      console.log(res.data);
      setUpdated(true);
    } catch (err) {
      console.log(err);
      setUpdated(false);
    }
  };

  const handleUserDelete = async () => {
    try {
      const res = await axios.delete(url + "/api/users/" + user._id, {
        withCredentials: true,
      });
      setUser(null);
      navigate("/");
      // console.log(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(url + "/api/auth/logout", {
        withCredentials: true,
      });
      console.log(res);
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-4xl backdrop-filter backdrop-blur-lg bg-opacity-30 bg-black rounded-xl p-4 flex items-center justify-between shadow-lg mt-4">
      <h1 className="text-lg md:text-2xl font-extrabold text-green-400">
        <Link to="/">Byte Scribe</Link>
      </h1>
      {path === "/" && (
        <div className="flex items-center space-x-2 bg-gray-800 bg-opacity-50 rounded-full px-3 py-1">
          <BsSearch className="text-white" />
          <input
            onChange={(e) => setPrompt(e.target.value)}
            className="outline-none bg-transparent text-white placeholder-gray-400"
            placeholder="Search a post"
            value={prompt}
            type="text"
          />
        </div>
      )}
      <div className="flex items-center space-x-4 relative">
        <h3>
          <Link
            to={"/myblogs/" + user?._id}
            className="text-white hover:text-green-400 transition duration-300"
          >
            My Blogs
          </Link>
        </h3>
        <button
          onClick={() => navigate("/write")}
          className="bg-green-400 text-black font-semibold py-1 px-4 rounded-full hover:bg-green-500 transition duration-300"
        >
          Create a Post
        </button>
        <div className="relative">
          <div className="cursor-pointer">
            <BsPersonCircle
              className="text-white text-2xl hover:text-green-400 transition duration-300"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
          </div>
          {showProfileMenu && (
            <div
              ref={profileMenuRef}
              className="absolute right-[-20px] top-10 mt-2 w-48 bg-slate-900 text-slate-300 rounded-md shadow-lg ring-1 ring-green-600 ring-opacity-5"
            >
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div className="px-4 py-2">
                  <h3 className="text-green-300 font-semibold">{username}</h3>
                  {/* <p className="">{email}</p> */}
                </div>
                <hr className="border-gray-500" />
                {/* <button
                  onClick={handleUserUpdate}
                  className="block px-4 py-2 text-sm hover:bg-gray-700 hover:bg-gray-70  w-full text-left"
                >
                  Update Profile
                </button> */}
                <button
                  onClick={handleUserDelete}
                  className="block px-4 py-2 text-sm text-red-200 hover:bg-gray-700 hover:text-red-300 w-full text-left"
                >
                  Delete Account
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm hover:bg-gray-700 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
