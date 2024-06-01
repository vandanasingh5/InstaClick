import axios from 'axios';
import React, { useEffect, useState,useContext } from 'react';
import { UserContext } from '../App';


const Profile = () => {

    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const {state, dispatch} = useContext(UserContext)



    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios.get('http://localhost:5000/myPost',{
                    headers:{
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    }
                })
                setData(response.data.mypost)
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    },[])

   // console.log(data);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios.get('http://localhost:5000/user',{
                    headers:{
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    }
                })
                setData2(response)
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    },[])

    console.log(data2);


  

    return (
        <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded shadow-md">
            <div className="flex items-center justify-center md:justify-start">
                <img src={state?state.pic:"loading"} alt="Profile" className="h-16 w-16 rounded-full mr-4" />
                <div>
                    <h1 className="text-xl font-bold">{state?.name}</h1>
                    
                    <div className="flex mt-2">
                        
                        <div className="mr-6">
                            <span className="font-bold">{}</span> posts
                        </div>
                        <div className="mr-6">
                            <span className="font-bold">{}</span> followers
                        </div>
                        <div>
                            <span className="font-bold">{}</span> following
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
                {data.map(post => (
                    <img key={post.id} src={post.photo} alt={`Post ${post.id}`} className="rounded-lg" />
                ))}
            </div>
        </div>
    );
};

export default Profile;
