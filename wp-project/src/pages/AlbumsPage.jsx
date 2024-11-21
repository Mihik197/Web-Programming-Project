// src/pages/AlbumsPage.jsx
import React, { useState, useEffect } from "react";
import useAxios from "../axiosInstance"; // Import the Axios instance
import { Plus, Edit2, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const AlbumsPage = () => {
	const axios = useAxios(); // Use the Axios instance
	const { token } = useAuth(); // Ensure you have access to the token
	const [albums, setAlbums] = useState([]);
	const [isCreating, setIsCreating] = useState(false);
	const [selectedAlbum, setSelectedAlbum] = useState(null);
	const [allImages, setAllImages] = useState([]);
	const [selectedImages, setSelectedImages] = useState([]);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});

	useEffect(() => {
		fetchAlbums();
		fetchAllImages();
	}, []);

	const fetchAllImages = async () => {
		try {
			const response = await axios.get("/api/days/images/all");
			console.log("Fetched Images:", response.data);
			setAllImages(response.data);
		} catch (error) {
			toast.error("Failed to fetch images");
			console.error("Error fetching images:", error);
		}
	};

	const fetchAlbums = async () => {
		try {
			const response = await axios.get("/api/albums");
			setAlbums(response.data);
		} catch (error) {
			toast.error("Failed to fetch albums");
			console.error("Error fetching albums:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (selectedImages.length === 0) {
			toast.error("Please select at least one image");
			return;
		}

		try {
			const albumData = {
				name: formData.name,
				description: formData.description,
				images: selectedImages.map((img) => ({
					dayId: img.dayId,
					imageId: img.imageId, // Make sure this is properly set
				})),
			};

			console.log("Submitting album data:", albumData); // Debug log

			if (selectedAlbum) {
				await axios.patch(
					`/api/albums/${selectedAlbum._id}`,
					albumData
				);
				toast.success("Album updated successfully");
			} else {
				await axios.post("/api/albums", albumData);
				toast.success("Album created successfully");
			}

			setIsCreating(false);
			setSelectedAlbum(null);
			setFormData({ name: "", description: "" });
			setSelectedImages([]);
			fetchAlbums();
		} catch (error) {
			console.error("Album submission error:", error);
			toast.error(
				error.response?.data?.message || "Failed to save album"
			);
		}
	};

	const handleDelete = async (albumId) => {
		if (!confirm("Are you sure you want to delete this album?")) return;

		try {
			await axios.delete(`/api/albums/${albumId}`);
			toast.success("Album deleted successfully");
			fetchAlbums();
		} catch (error) {
			toast.error("Failed to delete album");
		}
	};

	const toggleImageSelection = (dayId, image) => {
		const imageKey = `${dayId}-${image._id}`;

		if (
			selectedImages.some(
				(img) => `${img.dayId}-${img.imageId}` === imageKey
			)
		) {
			setSelectedImages(
				selectedImages.filter(
					(img) => `${img.dayId}-${img.imageId}` !== imageKey
				)
			);
		} else {
			setSelectedImages([
				...selectedImages,
				{
					dayId: dayId,
					imageId: image._id, // Make sure we're using image._id here
				},
			]);
		}
	};

	// When opening edit mode, load existing images
	const handleEditAlbum = (album) => {
		setSelectedAlbum(album);
		setFormData({
			name: album.name,
			description: album.description,
		});
		// Find and set selected images from existing album
		const albumImages = album.images
			.map((img) => {
				const dayImages = allImages.find(
					(day) => day.dayId === img.dayId
				);
				if (dayImages) {
					const foundImage = dayImages.images.find(
						(image) => image._id === img.imageId
					);
					if (foundImage) {
						return { ...foundImage, dayId: img.dayId };
					}
				}
				return null;
			})
			.filter(Boolean);

		setSelectedImages(albumImages);
		setIsCreating(true);
	};

	return (
		<div className="container mx-auto px-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Albums</h1>
				<button
					onClick={() => setIsCreating(true)}
					className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
				>
					<Plus size={20} />
					Create Album
				</button>
			</div>

			{(isCreating || selectedAlbum) && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
					<div className="bg-white rounded-lg p-6 max-w-4xl w-full my-8">
						<h2 className="text-xl font-bold mb-4">
							{selectedAlbum ? "Edit Album" : "Create New Album"}
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label className="block text-sm font-medium mb-1">
									Name
								</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) =>
										setFormData({
											...formData,
											name: e.target.value,
										})
									}
									className="w-full p-2 border rounded-lg"
									required
								/>
							</div>
							<div className="mb-4">
								<label className="block text-sm font-medium mb-1">
									Description
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									className="w-full p-2 border rounded-lg"
									rows="3"
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium mb-2">
									Select Images
								</label>
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-4 border rounded-lg">
									{allImages.map((day) => (
										<div
											key={day.dayId}
											className="space-y-2"
										>
											<h4 className="text-sm font-medium text-gray-500 sticky top-0 bg-white py-1">
												{new Date(
													day.date
												).toLocaleDateString()}
											</h4>
											{day.images.map((image) => {
												const isSelected =
													selectedImages.some(
														(img) =>
															`${img.dayId}-${img.imageId}` ===
															`${day.dayId}-${image._id}`
													);

												return (
													<div
														key={image._id}
														onClick={() =>
															toggleImageSelection(
																day.dayId,
																image
															)
														}
														className={`
              relative cursor-pointer rounded-lg overflow-hidden
              transition-all duration-200 ease-in-out
              ${isSelected ? "ring-2 ring-blue-500" : "hover:opacity-75"}
            `}
													>
														<img
															src={image.url} // Use the URL directly
															alt={
																image.caption ||
																"Album image"
															}
															className="w-full h-32 object-cover"
															onError={(e) => {
																console.error(
																	"Image load error:",
																	image.url
																);
																e.target.src =
																	"https://via.placeholder.com/150"; // Fallback image
															}}
														/>
														{isSelected && (
															<div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
																<Check
																	size={12}
																/>
															</div>
														)}
													</div>
												);
											})}
										</div>
									))}
								</div>

								<p className="mt-2 text-sm text-gray-500">
									Selected {selectedImages.length} images
								</p>
							</div>

							<div className="flex justify-end gap-2">
								<button
									type="button"
									onClick={() => {
										setIsCreating(false);
										setSelectedAlbum(null);
										setFormData({
											name: "",
											description: "",
										});
										setSelectedImages([]);
									}}
									className="px-4 py-2 border rounded-lg"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-blue-600 text-white rounded-lg"
								>
									{selectedAlbum ? "Update" : "Create"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{albums.map((album) => (
					<div
						key={album._id}
						className="bg-white rounded-lg shadow-lg overflow-hidden"
					>
						{album.images.length > 0 && (
							<div className="aspect-video relative">
								<img
									src={`http://localhost:5000/api/days/${
										new Date(album.updatedAt)
											.toISOString()
											.split("T")[0]
									}/images/${album.images[0].imageId}`}
									alt={album.name}
									className="w-full h-48 object-cover"
									onError={(e) => {
										e.target.src = "placeholder-image-url"; // Add a placeholder image URL
										e.target.onerror = null;
									}}
								/>
								{album.images.length > 1 && (
									<div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
										+{album.images.length - 1}
									</div>
								)}
							</div>
						)}
						<div className="p-4">
							<div className="flex justify-between items-start">
								<div>
									<h3 className="text-lg font-semibold">
										{album.name}
									</h3>
									<p className="text-gray-600 text-sm">
										{album.description}
									</p>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => handleEditAlbum(album)}
										className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
									>
										<Edit2 size={16} />
									</button>
									<button
										onClick={() => handleDelete(album._id)}
										className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
									>
										<Trash2 size={16} />
									</button>
									<Link to={`/app/albums/${album._id}`}>
										<button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
											View
										</button>
									</Link>
								</div>
							</div>
							<div className="mt-2 text-sm text-gray-500">
								{album.images.length} images
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AlbumsPage;
