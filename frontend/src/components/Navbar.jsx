import {
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [username, setUsername] = useState("");
  const profileMenuRef = useRef();
  const url = "https://byte-scribe-backend.onrender.com";
  const userData = JSON.parse(localStorage.getItem("user"));

  // Fetch user info on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(url + "/api/users/" + userData._id, { timeout: 5000 });
        setUsername(res.data.username);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (userData) {
      fetchProfile();
    } else {
      navigate("/login");
    }
  }, [userData, navigate]);

  // Close profile dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const handleUserDelete = async () => {
  //   try {
  //     await axios.delete(url + "/api/users/" + userData._id, {
  //       withCredentials: true,
  //     });
  //     setUser(null);
  //     localStorage.removeItem("user");
  //     navigate("/");
  //   } catch (err) {
  //     console.error("Error deleting user:", err);
  //   }
  // };

  const handleLogout = async () => {
    try {
      await axios.get(url + "/api/auth/logout", {
        withCredentials: true,
      });
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-4xl backdrop-filter backdrop-blur-lg bg-opacity-30 bg-black rounded-xl p-4 flex items-center justify-between shadow-lg mt-4">
      <h1 className="text-lg md:text-2xl font-extrabold text-green-400">
        <Link to="/">Byte Scribe</Link>
      </h1>
      <div className="flex items-center space-x-4 relative">
        <h3>
          <Link
            to={"/myblogs/" + (userData?._id || user?._id)}
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
          <div className="cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <BsPersonCircle className="text-white text-2xl hover:text-green-400 transition duration-300" />
          </div>
          {showProfileMenu && (
            <div
              ref={profileMenuRef}
              className="absolute right-[-20px] z-100 top-10 mt-2 w-48 bg-slate-900 text-slate-300 rounded-md shadow-lg ring-1 ring-green-600 ring-opacity-5"
            >
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <div className="px-4 py-2">
                  <h3 className="text-green-300 font-semibold">{username}</h3>
                </div>
                <hr className="border-gray-500" />
                {/* <button
                  onClick={handleUserDelete}
                  className="block px-4 py-2 text-sm text-red-200 hover:bg-gray-700 hover:text-red-300 w-full text-left"
                >
                  Delete Account
                </button> */}
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
