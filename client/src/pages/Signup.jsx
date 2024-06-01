import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")


    const Navigate = useNavigate();

    //user pic logic
    const uploadPic = async() => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'Insta-Clone');
        formData.append('cloud_name', 'dyuqftfhd');

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dyuqftfhd/image/upload', formData);
            const imageUrl = response.data.secure_url;
            console.log('url:', imageUrl);
            setUrl(imageUrl);
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload image');
        }
    }

    const isValidEmail = (email) => {
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(image){
            uploadPic()
        }

        if (!username || !email || !password) {
            toast.error('All fields are required');
            return;
        }

        if (!isValidEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/signup', {
                name: username,
                email: email,
                password: password,
                pic:url
            });

            //console.log(response.data);
            toast.success('Sign up successful');
            Navigate('/signin')
        } catch (error) {
            if (error.response && error.response.status === 422) {
                toast.error('User already exists with the same email');
            }
        }
    };

   

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Sign Up for Instagram</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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

                <div className="mb-6">
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Upload pic</label>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} className="mt-1 p-2 w-full border border-gray-300 rounded" />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={(e) => handleSubmit(e)}
                >
                    Sign Up
                </button>
                <p className="mt-4 text-sm text-gray-600">
                    Already have an account? <Link to="/signin" className="text-blue-500">Sign In</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;