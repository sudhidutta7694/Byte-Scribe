import { useNavigate, useParams } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import axios from "axios";
import { URL, IF } from "../url";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostReview = () => {
  const postId = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [suggestion, setSuggestion] = useState("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(URL + `/api/posts/${postId}`);
        setPost(res.data);
        setLoader(false);
      } catch (err) {
        console.error(err);
        setLoader(false);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(URL + `/api/posts/review/${postId}/suggestions`);
        setSuggestion(res.data || ""); // Assuming it's a single suggestion, adjust if multiple
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
    fetchSuggestions();
  }, [postId]);

  const handleApprovePost = async () => {
    try {
      const newStatus = post.status === 'approved' ? 'in review' : 'approved';
      await axios.put(`${URL}/api/posts/approve/${postId}`, { approved: newStatus === 'approved', status: newStatus }, { withCredentials: true });
      setPost((prevPost) => ({ ...prevPost, status: newStatus }));
      toast.success(`Post status updated to ${newStatus}!`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      console.log(err);
      toast.error('Failed to update post status.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleRejectPost = async () => {
    try {
      const newStatus = post.status === 'rejected' ? 'in review' : 'rejected';
      await axios.put(`${URL}/api/posts/reject/${postId}`, { approved: newStatus === 'rejected', status: newStatus }, { withCredentials: true });
      setPost((prevPost) => ({ ...prevPost, status: newStatus }));
      toast.success(`Post status updated to ${newStatus}!`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      console.log(err);
      toast.error('Failed to update post status.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleReviewPost = async () => {
    try {
      await axios.put(`${URL}/api/posts/review/${postId}`, { suggestions: suggestion, status: "in review" }, { withCredentials: true });
      toast.success('Suggestion has been added!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      toast.error('Failed to add suggestion.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {loader ? (
        <div className="h-full flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <>
          <div className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-10 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-white">Review Post</h1>
              {user?.isAdmin && (
                <div className="flex items-center space-x-2">
                  <button
                    className={`bg-${post.status === 'approved' ? 'gray-600' : 'green-600'} text-sm text-white px-4 py-2 rounded-lg hover:bg-${post.status === 'approved' ? 'gray-700' : 'green-700'}`}
                    onClick={handleApprovePost}
                  >
                    {post.status === 'approved' ? 'Approved' : 'Approve'}
                  </button>
                  <button
                    className={`bg-${post.status === 'rejected' ? 'gray-600' : 'red-600'} text-sm text-white px-4 py-2 rounded-lg hover:bg-${post.status === 'rejected' ? 'gray-700' : 'red-700'}`}
                    onClick={handleRejectPost}
                  >
                    {post.status === 'rejected' ? 'Rejected' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <h2 className="text-lg font-semibold mb-2 md:mb-0">Got Some Suggestions?</h2>
              <input
                onChange={(e) => setSuggestion(e.target.value)}
                type="text"
                placeholder="Provide a suggestion"
                value={suggestion}
                className="flex-1 outline-none py-2 px-4 bg-gray-800 text-white border border-gray-700 rounded-lg"
              />
              <button
                onClick={handleReviewPost}
                className="bg-blue-600 text-sm text-white px-4 py-2 mt-2 md:mt-0 rounded-lg hover:bg-blue-700"
              >
                Add Suggestion
              </button>
            </div>
          </div>
          <div className="pt-24 px-8 md:px-[200px] flex-1 overflow-y-auto">
            <div className="bg-slate-800 mt-10 p-6 rounded-lg shadow-lg">
              {post.photo && (
                <img src={IF + post.photo} className="w-full mx-auto rounded-lg shadow-lg max-h-96 object-cover mb-4" alt="Post visual" />
              )}
              <div className="flex items-center text-gray-400 mb-4">
                <FaUserCircle className="text-3xl mr-2" />
                <div>
                  <p className="text-lg font-semibold">{post.username}</p>
                  <div className="flex space-x-4 text-sm">
                    <p>Posted on {' '} {formatDate(post.updatedAt)}</p>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
              <div className="flex items-center space-x-2 font-semibold text-gray-300 mb-4">
                {post.categories?.map((c, i) => (
                  <span key={i} className="rounded-full text-md font-mono" style={{ color: getRandomColor() }}>
                    #{c}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed">{post.desc}</p>
            </div>
            <ToastContainer />
            <div className="h-6"></div>
          </div>
        </>
      )}
    </div>
  );
};

const getRandomColor = () => {
  const colors = ['#F56565', '#ED8936', '#ECC94B', '#48BB78', '#38B2AC', '#4299E1', '#0BC5EA', '#9F7AEA', '#ED64A6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default PostReview;
