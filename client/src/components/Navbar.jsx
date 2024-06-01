import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { MdOutlineCreateNewFolder } from "react-icons/md";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const renderList = () => {
    if (state) {
      return (
        <>
          <li className="mr-4">
            <Link to="/profile" className="hidden md:inline-block">
              Profile
            </Link>
          </li>
          <li className="mr-4">
            <Link to="/create" className="hidden md:inline-block text-3xl">
            <MdOutlineCreateNewFolder />
            </Link>
          </li>
          <li  className="mr-4"><Link to={'/myfollowingpost'}>my followers post</Link></li>
          <li
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              navigate("/signin");
            }}
            className="cursor-pointer"
          >
            Logout
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="mr-4">
            <Link to="/signin" className="hidden md:inline-block">
              Signin
            </Link>
          </li>
          <li className="mr-4">
            <Link to="/signup" className="hidden md:inline-block">
              Signup
            </Link>
          </li>
        </>
      );
    }
  };
  
  

  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center">
      <div>
        <Link to={state ? "/" : "/signin"} className="flex items-center">
          <img
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Instagram"
            className="h-8"
          />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ul className="hidden md:flex">{renderList()}</ul>
        <button
          className="block md:hidden"
          onClick={() => setShowMenu(!showMenu)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
      {showMenu && <ul className="md:hidden">{renderList()}</ul>}
    </nav>
  );
};

export default Navbar;
