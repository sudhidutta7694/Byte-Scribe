import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { URL } from "../url";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const EditPost = () => {
  const postId = useParams().id;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/" + postId);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setFile(res.data.photo);
      setCats(res.data.categories);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const post = {
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats,
      status: "pending",
      approved: false,
    };

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("img", filename);
      data.append("file", file);
      post.photo = filename;
      try {
        await axios.post(URL + "/api/upload", data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      const res = await axios.put(URL + "/api/posts/" + postId, post, {
        withCredentials: true,
      });
      navigate("/posts/post/" + res.data._id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const deleteCategory = (i) => {
    let updatedCats = [...cats];
    updatedCats.splice(i, 1);
    setCats(updatedCats);
  };

  const addCategory = () => {
    if (cat.trim() === "") return;
    let updatedCats = [...cats];
    updatedCats.push(cat);
    setCat("");
    setCats(updatedCats);
  };

  return (
    <div className="bg-slate-800 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mt-24 mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Update post</h1>
        <form className="flex flex-col space-y-4">
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Enter post title"
            className="px-4 py-2 outline-none bg-gray-700 text-white rounded-md"
          />
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            className="px-4 py-2 outline-none bg-gray-700 text-white rounded-md"
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-4">
              <input
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="px-4 py-2 outline-none bg-gray-700 text-white rounded-md"
                placeholder="Enter post category"
                type="text"
              />
              <button
                type="button"
                onClick={addCategory}
                className="bg-green-500 text-white px-4 py-2 font-semibold rounded-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap mt-3">
              {cats?.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2 bg-gray-200 px-2 py-1 rounded-md mr-2 mb-2"
                >
                  <p>{c}</p>
                  <button
                    type="button"
                    onClick={() => deleteCategory(i)}
                    className="text-red-500 hover:bg-gray-300 rounded-full p-1"
                  >
                    <ImCross />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            rows={10}
            className="px-4 py-2 outline-none bg-gray-700 text-white rounded-md min-h-[40vh]"
            placeholder="Enter post description"
          />
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-4 py-2 font-semibold rounded-md"
          >
            Update
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditPost;
