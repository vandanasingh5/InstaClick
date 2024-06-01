import React, { createContext,useEffect,useReducer, useContext } from 'react'
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Signin from './pages/signin'
import Signup from './pages/Signup'
import CreatePost from './pages/CreatePost'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { reducers,initialState } from './reducers/userReducer';
import UserProfile from './pages/UserProfile';
import SubscribeUser from './pages/SubscribeUser';


export const UserContext = createContext()

const Routing = () => {
  const {state, dispatch} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({type: "USER", payload: user});
    } else {
      if (!window.location.pathname.startsWith('/reset')) {
        navigate('/signin');
      }
    }
  }, []); // Empty dependency array to run only once

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile/:userid" element={<UserProfile />} />
        <Route path="/myfollowingpost" element={<SubscribeUser />} />
      </Routes>
    </>
  );
};


const App = () => {
  
  const [state,dispatch] = useReducer(reducers, initialState)
  return (
    
    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
    <ToastContainer />
    <Navbar />
    
      <Routing />


    </BrowserRouter>
    </UserContext.Provider>
    
  )
}

export default App