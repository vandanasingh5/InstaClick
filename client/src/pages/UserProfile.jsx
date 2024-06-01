import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    const [showfollow, setShowFollow] = useState(state ? state.following && state.following.indexOf(userid) === -1 : true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${userid}`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    }
                });
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const followUser = () => {
        axios.put('http://localhost:5000/follow', { followId: userid }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(({ data }) => {
            dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
            localStorage.setItem("user", JSON.stringify(data));
            setProfile(prevProfile => ({
                ...prevProfile,
                user: {
                    ...prevProfile.user,
                    followers: [...prevProfile.user.followers, data._id]
                }
            }));
            setShowFollow(false);
        })
        .catch(error => console.log(error));
    };

    const unfollowUser = () => {
        axios.put('http://localhost:5000/unfollow', { unfollowId: userid }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(({ data }) => {
            dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
            localStorage.setItem("user", JSON.stringify(data));
            setProfile(prevProfile => ({
                ...prevProfile,
                user: {
                    ...prevProfile.user,
                    followers: prevProfile.user.followers.filter(item => item !== data._id)
                }
            }));
            setShowFollow(true);
        })
        .catch(error => console.log(error));
    };

    if (loading) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded shadow-md">
            <ToastContainer />
            {profile.user && (
                <div className="flex items-center justify-center md:justify-start">
                    <img src={profile.user.pic} alt="Profile" className="h-16 w-16 rounded-full mr-4" />
                    <div>
                        <h1 className="text-xl font-bold">{profile.user.name}</h1>
                        <div className="flex mt-2">
                            <div className="mr-6">
                                <span className="font-bold">{profile.posts.length}</span> posts
                            </div>
                            <h6>{profile.user.followers.length} followers</h6>
                            <h6>{profile.user.following.length} following</h6>
                        </div>
                        <div>
                            {showfollow ? (
                                <button
                                    style={{ margin: "10px" }}
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={followUser}
                                >
                                    Follow
                                </button>
                            ) : (
                                <button
                                    style={{ margin: "10px" }}
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={unfollowUser}
                                >
                                    Unfollow
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div>
                {profile.posts && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        {profile.posts.map((post) => (
                            <img key={post._id} src={post.photo} alt="" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


export default UserProfile;
