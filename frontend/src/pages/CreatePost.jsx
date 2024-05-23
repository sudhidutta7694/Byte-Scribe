/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ImCross } from "react-icons/im";
import { URL } from "../url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
// import { UserContext } from '../context/UserContext'
// import ReactMarkdown from "react-markdown";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css"; // Import Quill styles

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [preview, setPreview] = useState(false);
  // const {user}=useContext(UserContext)
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

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

  const handleCreate=async (e)=>{
    e.preventDefault()
    const post={
      title,
      desc,
      username:user.username,
      userId:user._id,
      categories:cats
    }

    if(file){
      const data=new FormData()
      const filename=Date.now()+file.name
      data.append("img",filename)
      data.append("file",file)
      post.photo=filename
      // console.log(data)
      //img upload
      try{
        // eslint-disable-next-line no-unused-vars
        const imgUpload=await axios.post(URL+"/api/upload",data, {withCredentials:true})
        // console.log(imgUpload.data)
      }
      catch(err){
        console.log(err)
      }
    }
    //post upload
    // console.log(post)
    try{
      const res=await axios.post(URL+"/api/posts/create",post,{withCredentials:true})
      navigate("/posts/post/"+res.data._id)
      // console.log(res.data)

    }
    catch(err){
      console.log(err)
    }
}

  return (
    <div className="bg-slate-800 h-screen flex flex-1 items-center justify-center">
      <Navbar />
      <div className="container mx-auto mt-8">
        <h1 className="font-bold text-3xl mb-4 text-white">{!preview ?"Create a post" : "Preview post"}</h1>
        {preview ? (
          <PreviewPost
            title={title}
            desc={desc}
            cats={cats}
            file={file}
            onEdit={() => setPreview(false)}
          />
        ) : (
          <form className="w-full flex flex-col space-y-4 bg-gray-900 p-6 rounded-lg">
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="New post title here..."
              className="px-4 py-2 outline-none bg-gray-800 text-white rounded-md text-xl font-semibold"
            />
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              className="px-4 py-2 bg-gray-800 text-white rounded-md"
            />
            <div className="flex flex-col">
              <div className="flex items-center space-x-4">
                <input
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="px-4 py-2 outline-none bg-gray-800 text-white rounded-md"
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
            {/* <ReactQuill
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Write your post here..."
              theme="snow" // Specify Quill theme ('snow' or 'bubble')
              className="text-white bg-gray-800 p-4 rounded-md"
            /> */}
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Write your post here..."
              className="px-4 py-2 outline-none bg-gray-800 text-white rounded-md h-60 md:h-80 lg:h-92 resize-none"
              style={{ minHeight: "340px" }}
            />

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setPreview(true)}
                className="bg-blue-500 text-white px-4 py-2 font-semibold rounded-md"
              >
                Preview
              </button>
              <button
                onClick={handleCreate}
                className="bg-green-500 text-white px-4 py-2 font-semibold rounded-md"
              >
                Publish
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

const PreviewPost = ({ title, desc, cats, file, onEdit }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const getRandomColor = () => {
    const colors = [
      "#F56565",
      "#ED8936",
      "#ECC94B",
      "#48BB78",
      "#38B2AC",
      "#4299E1",
      "#0BC5EA",
      "#9F7AEA",
      "#ED64A6",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <>
    <div className="bg-slate-900 max-h-[68vh] overflow-y-auto mt-4 p-6 rounded-lg shadow-lg">
      {/* <h2 className="text-4xl font-bold text-white mb-4">{title}</h2> */}
      {file && (
        <img
          src={imageSrc}
          alt="Post Cover"
          className="w-full mx-auto rounded-lg shadow-lg max-h-96 object-cover mb-4"
        />
      )}
      <div className="flex items-center text-gray-400 mb-4">
      <FaUserCircle className="text-3xl mr-2" />
      <div>
        <p className="text-lg font-semibold">Username</p>
        <div className="flex space-x-4 text-sm">
          <p>Posted on Date</p>
        </div>
      </div>
      </div>
      <div className="flex flex-wrap mb-4">
        {cats.map((cat, index) => (
          <span
            key={index}
            className="rounded-full text-md font-mono pr-2"
            style={{ color: getRandomColor() }}
          >
            #{cat}
          </span>
        ))}
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
      <p className="text-gray-300 leading-relaxed">{desc}</p>
      
    </div>
    <div className="ml-5 mt-4 mb-4">
        <button
          onClick={onEdit}
          className="bg-green-600 text-white px-4 py-2 font-semibold rounded-md"
        >
          Edit
        </button>
      </div>
    </>
  );
};

export default CreatePost;
