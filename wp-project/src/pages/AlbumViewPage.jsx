// src/pages/AlbumViewPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../axiosInstance"; // Use the Axios instance
import toast from "react-hot-toast";

const AlbumViewPage = () => {
	const { albumId } = useParams();
	const axios = useAxios();
	const [album, setAlbum] = useState(null);
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAlbum();
	}, [albumId]);

	const fetchAlbum = async () => {
		try {
			const response = await axios.get(`/api/albums/${albumId}`);
			setAlbum(response.data);
			
			// Images now have complete URLs from the backend
			const enhancedImages = response.data.images.map(img => ({
				...img,
				url: `http://localhost:5000${img.url}`
			}));
			
			setImages(enhancedImages);
			setLoading(false);
		} catch (error) {
			toast.error("Failed to fetch album details");
			console.error("Error fetching album:", error);
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	if (!album) {
		return <div className="text-center mt-10">Album not found.</div>;
	}

	return (
		<div className="container mx-auto px-4 py-6">
			<h1 className="text-3xl font-bold mb-4">{album.name}</h1>
			{album.description && (
				<p className="text-gray-600 mb-6">{album.description}</p>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{images.map((image) => (
					<div key={image.imageId} className="relative">
						<img
							src={image.url}
							alt={image.caption || "Album Image"}
							className="w-full h-48 object-cover rounded-lg"
							onError={(e) => {
								console.error('Image load error:', image.url);
								e.target.src = 'https://via.placeholder.com/150';
							}}
						/>
						{image.caption && (
							<div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
								{image.caption}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default AlbumViewPage;
