import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../App";

const Signin = () => {
const {state, dispatch} = useContext(UserContext)


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("UserName and password are required");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/signin", {
        email: email,
        password: password,
      });
      console.log(response.data);
      const token = response.data.token;
      dispatch({type:"USER", payload:response.data.user})
      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      navigate("/");
    } catch (error) {
      console.error(error.message);
      toast.error("user is not exist ");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Sign In to Instagram</h1>
      <form>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e) => signIn(e)}
        >
          Sign In
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signin;
