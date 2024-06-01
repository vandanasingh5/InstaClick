import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [photo, setPhoto] = useState('');
    const [url, setUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const postRequest = async () => {
            const token = localStorage.getItem('jwt');
            if (!token) {
                toast.error('Unauthorized');
                return;
            }

            try {
                const postResponse = await axios.post('http://localhost:5000/createPost', {
                    title: title,
                    body: body,
                    pic: url
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(postResponse);
                toast.success('Post is created');
                navigate('/');
            } catch (error) {
                console.error(error.message);
                toast.error('Failed to create post');
            }
        };

        if (url) {
            postRequest();
        }
    }, [url, title, body, navigate]);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('file', photo);
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
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Create Post</h1>
            <form>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded" />
                </div>
                <div className="mb-4">
                    <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body</label>
                    <textarea id="body" name="body" value={body} onChange={(e) => setBody(e.target.value)} rows="4" className="mt-1 p-2 w-full border border-gray-300 rounded"></textarea>
                </div>
                <div className="mb-6">
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
                    <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="mt-1 p-2 w-full border border-gray-300 rounded" />
                </div>
                <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleSubmit()}>Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;

