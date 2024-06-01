import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { UserContext } from "../App";
import { MdDelete } from "react-icons/md";

const SubscribeUser = () => {
  const [data, setData] = useState([]);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getsubpost", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        });
        setData(response.data);
      } catch (error) {
        console.log(error);
        // Redirect to the sign-in page if there's an error or the user is not authenticated
        navigate("/signin");
      }
    };

    if (localStorage.getItem("jwt")) {
      fetchData();
    } else {
      // Redirect to the sign-in page if the user is not authenticated
      navigate("/signin");
    }
  }, [navigate]);

  const likePost = async (id) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/like",
        { postId: id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
            "Content-Type": "application/json",
          },
        }
      );
      // Update the UI with the updated post data
      setData((prevData) =>
        prevData.map((post) =>
          post._id === id
            ? { ...post, likes: response.data.likes, likedByCurrentUser: true }
            : post
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const disLike = async (id) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/unlike",
        { postId: id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
            "Content-Type": "application/json",
          },
        }
      );
      // Update the UI with the updated post data
      setData((prevData) =>
        prevData.map((post) =>
          post._id === id
            ? { ...post, likes: response.data.likes, likedByCurrentUser: false }
            : post
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const makeComment = async (e, postId) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5000/comment",
        { postId, text: commentText },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
            "Content-Type": "application/json",
          },
        }
      );
      // Update the UI with the updated post data
      setData((prevData) =>
        prevData.map((post) =>
          post._id === postId
            ? { ...post, comments: response.data.comments }
            : post
        )
      );
      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = (postid)=>{
        fetch(`http://localhost:5000/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }
  

  const deleteComment = async (postId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/deletecomment/${postId}/${commentId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      );
      // Update the UI by removing the deleted comment from the post
      setData((prevData) =>
        prevData.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment._id !== commentId
                ),
              }
            : post
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {data.map((post) => (
          <div
            key={post._id}
            className="border border-gray-300 rounded-lg overflow-hidden"
          >
            <img
              src={post.photo}
              alt={`Post by ${post.postedBy.name}`}
              className="w-full h-screen"
            />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-gray-800 font-bold">
                    <Link to={post.postedBy._id !== state._id?'/profile/'+post.postedBy._id : "/profile"}>{post.postedBy.name}</Link>
                  </p>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-sm text-gray-600">{post.body}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => likePost(post._id)}
                    className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${
                      post.likedByCurrentUser ? "hidden" : ""
                    }`}
                  >
                    <AiOutlineLike />
                  </button>
                  <button
                    onClick={() => disLike(post._id)}
                    className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
                      post.likedByCurrentUser ? "" : "hidden"
                    }`}
                  >
                    <AiOutlineDislike />
                  </button>
                  <h5 style={{ padding: "5px" }}>
    {post.postedBy._id === state._id && (
        <i
            className="material-icons"
            style={{ float: "right" }}
            onClick={() => deletePost(post._id)}
        >
            <MdDelete />
        </i>
    )}
</h5>

                </div>

                <span>{post.likes.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </div>
              <div className="mt-4">
                {/* Comment Section */}
                <div className="border-b border-gray-300 pb-2">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="mb-2">
                      <p className="text-sm font-semibold">
                        {comment.postedBy.name}
                      </p>
                      <p className="text-sm">{comment.text}</p>
                      <button
                        onClick={() => deleteComment(post._id, comment._id)}
                        className="text-red-500 hover:text-red-700 font-semibold"
                      >
                        Delete Comment
                      </button>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e, post._id);
                  }}
                >
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mt-1"
                  >
                    Comment
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscribeUser;
