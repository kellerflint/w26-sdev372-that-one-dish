import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DishImage from "../assets/DishImage.png";
import PlusIcon from "../assets/PlusIcon.png";

function AddDish() {
  const [formData, setFormData] = useState({
    dish_name: "",
    cuisine: "",
    dish_details: "",
    restaurant_name: "",
    restaurant_address: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [origin, setOrigin] = useState("restaurant");
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (origin === "home") {
      setFormData((prev) => ({
        ...prev,
        restaurant_name: "",
        restaurant_address: ""
      }));
    }
  }, [origin]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file
      });
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();

    formPayload.append("dish_name", formData.dish_name);
    formPayload.append("cuisine", formData.cuisine);
    formPayload.append("dish_details", formData.dish_details);
    formPayload.append("restaurant_name", formData.restaurant_name);
    formPayload.append("restaurant_address", formData.restaurant_address);

    if (formData.image) {
      formPayload.append("image", formData.image);
    }

    try {

      const res = await fetch("http://100.117.135.17:3000/api/dishes", {
        method: "POST",
        body: formPayload
      });

      if (!res.ok) throw new Error("Failed to add dish");

      alert("Dish added successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error adding dish. Check if backend is running on port 3000!");
    }
  };

  return (
    <div className="add-dish-container">
      <h2 className="form-title">Add a New Favorite Dish</h2>

      <form onSubmit={handleSubmit} className="dish-form">
        <div className="form-group">
          <label className="label-center">Upload Photo</label>
          <div 
            className="image-box"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" />
            ) : (
              <div className="placeholder-container">
                <img src={PlusIcon} alt="Plus Icon" className="placeholder" />
                <img src={DishImage} alt="Placeholder" className="placeholder-image" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            className="hidden-input"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Dish Name</label>
          <input
            name="dish_name"
            placeholder="e.g. Cheese Burger"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Cuisine</label>
            <input
              name="cuisine"
              placeholder="e.g. American, Italian, etc."
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Where did you have this dish?</label>
            <label>
              <input
                type="radio"
                name="origin"
                value="restaurant"
                checked={origin === "restaurant"}
                onChange={() => setOrigin("restaurant")}
              />
              At a restaurant
            </label>

            <label>
              <input
                type="radio"
                name="origin"
                value="home"
                checked={origin === "home"}
                onChange={() => setOrigin("home")}
              />
              Home made
            </label>
          </div>

        </div>

        {origin === "restaurant" && (
          <>
            <div className="form-group">
              <label>Restaurant Name</label>
              <input
                name="restaurant_name"
                placeholder="e.g. That One Place"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Restaurant Address</label>
              <input
                name="restaurant_address"
                placeholder="123 Street, City, State"
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Dish Details</label>
          <textarea
            name="dish_details"
            placeholder="What makes this dish so good?"
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button className="button-secondary" type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
          <button className="submit-button" type="submit">
            Add to Gallery
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDish;