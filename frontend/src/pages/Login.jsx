import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useState } from "react";
import axios from 'axios';
import { URL } from '../url';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(URL + "/api/auth/login", { email, password }, { withCredentials: true });
      // console.log(res.data);
      if (res?.data?.isAdmin)  {
        navigate("/dashboard");
      }else if (res?.data){
        navigate("/");
      }
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-200 mb-8">Byte Scribe</h1>
        <div className="bg-slate-800 bg-opacity-70 rounded-lg p-8 w-[400px] max-w-full">
          <h1 className="text-xl md:text-2xl font-bold text-slate-100 mb-6 text-center">Log in to your account</h1>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 bg-transparent border-b-2 border-slate-200 text-slate-100 placeholder-slate-400 focus:outline-none"
            type="text"
            placeholder="Enter your email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-6 bg-transparent border-b-2 border-slate-200 text-slate-100 placeholder-slate-400 focus:outline-none"
            type="password"
            placeholder="Enter your password"
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-3 text-lg font-bold text-slate-900 bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
          >
            Log in
          </button>
          {error && <h3 className="text-red-500 text-sm mt-4">Something went wrong</h3>}
          <div className="flex justify-center items-center space-x-3 mt-6">
            <p className="text-slate-200">New here?</p>
            <p className="text-green-500 font-semibold hover:text-green-600"><Link to="/register">Register</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
