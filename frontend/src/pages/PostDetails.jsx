import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IF, URL } from "../url";
import { UserContext } from "../context/UserContext";
import Comment from "../components/Comment";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { FaUserCircle } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(URL + "/api/posts/" + id , {
          withCredentials: true,
        });
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchPostComments = async () => {
      setLoader(true);
      try {
        const res = await axios.get(URL + "/api/comments/post/" + id, {
          withCredentials: true,
        });
        setComments(res.data);
        setLoader(false);
      } catch (err) {
        console.log(err);
        setLoader(false);
      }
    };
    fetchPostComments();
  }, [id]);

  const postComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        URL + "/api/comments/create",
        { comment, author: user.username, postId: id, userId: user._id },
        { withCredentials: true }
      );
      setComment("");
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditComment = async (id, comment) => {
    try {
      const res = await axios.put(URL + "/api/comments/" + id, { comment },
        { withCredentials: true });
      console.log(res.data);
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteComment = async (id) => {
    try {
      await axios.delete(URL + "/api/comments/" + id, { withCredentials: true });
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(URL + "/api/posts/" + id, { withCredentials: true });
      console.log(res.data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRandomColor = () => {
    const colors = ['#F56565', '#ED8936', '#ECC94B', '#48BB78', '#38B2AC', '#4299E1', '#0BC5EA', '#9F7AEA', '#ED64A6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      {loader ? (
        <div className="flex justify-center items-center flex-1">
          <Loader />
        </div>
      ) : (
        <div className="bg-slate-700 flex-1 overflow-y-auto pt-24 px-8 md:px-[200px]">
          <div className="bg-slate-800 mt-4 p-6 rounded-lg shadow-lg">
            {post.photo && (
              <img src={IF + post.photo} className="w-full mx-auto rounded-lg shadow-lg max-h-96 object-cover mb-4" alt="Post visual" />
            )}
            <div className="flex items-center text-gray-400 mb-4">
              <FaUserCircle className="text-3xl mr-2" />
              <div>
                <p className="text-lg font-semibold">{post.username}</p>
                <div className="flex space-x-4 text-sm">
                  <p>Posted on {formatDate(post.updatedAt)}</p>
                </div>
              </div>
              {user?._id === post?.userId && (
                <div className="ml-auto flex gap-2">
                  <MdDelete className="text-red-500 cursor-pointer" onClick={handleDeletePost} />
                  <MdEdit className="text-green-500 cursor-pointer ml-2" onClick={() => navigate("/edit/" + id)} />
                </div>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center space-x-2 font-semibold text-gray-300 mb-4">
              {post.categories?.map((c, i) => (
                <span key={i} className="rounded-full text-md font-mono px-2" style={{ color: getRandomColor() }}>
                  #{c}
                </span>
              ))}
            </div>
            <p className="text-gray-300 leading-relaxed">{post.desc}</p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-400">Comments:</h3>
            <div className="mt-4 flex flex-col md:flex-row rounded-lg mb-8">
            <input
              onChange={(e) => setComment(e.target.value)}
              type="text"
              placeholder="Write a comment..."
              className="bg-slate-800 border border-1 border-slate-500 text-slate-200 md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0 rounded-l-lg"
              value={comment}
            />
            <button onClick={postComment} className="bg-green-600 border border-1 border-slate-500 text-sm text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0 rounded-r-lg">
              Add Comment
            </button>
          </div>
            {comments.map((c) => (
              <div key={c._id} className="bg-slate-800 p-4 rounded-lg mb-4">
                <div className="flex items-center text-gray-400 mb-2">
                  <FaUserCircle className="text-2xl mr-2" />
                  <div>
                    <p className="text-md font-semibold">{c.author}</p>
                    <div className="flex space-x-4 text-sm">
                      <p>{formatDate(c.createdAt)}</p>
                    </div>
                  </div>
                  {/* {user?._id === c.userId && (
                    <div className="ml-auto flex gap-2">
                      <MdDelete onClick={handleDeleteComment} className="text-red-500 cursor-pointer" />
                      <MdEdit onClick={handleEditComment} className="text-green-500 cursor-pointer ml-2" />
                    </div>
                  )} */}
                </div>
                <p className="text-gray-300 leading-relaxed">{c.comment}</p>
              </div>
            ))}
          </div>
          
          <div className="h-20"></div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PostDetails;
