import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../assets/Icon.png";

export default function Gallery() {
  const [dishes, setDishes] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://100.117.135.17:3000/api/dishes")
      .then((res) => res.json())
      .then((data) => setDishes(data))
      .catch((err) => console.error("Error fetching dishes:", err));
  }, []);

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2 className="gallery-title">Dish Gallery</h2>
        
        <div className="header-controls">
          <div className="filter-dropdown">
          <button 
            className={`dropdown-button ${dropdownOpen ? 'open' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {filterType === 'all' ? 'All Dishes' : filterType === 'home' ? 'Home Dishes' : 'Restaurant Dishes'}
            <span className="dropdown-arrow">{dropdownOpen ? '▼' : '▶'}</span>
          </button>
          
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button 
                className={`dropdown-item ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('all');
                  setDropdownOpen(false);
                }}
              >
                All Dishes
              </button>
              <button 
                className={`dropdown-item ${filterType === 'home' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('home');
                  setDropdownOpen(false);
                }}
              >
                Home Dishes
              </button>
              <button 
                className={`dropdown-item ${filterType === 'restaurant' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('restaurant');
                  setDropdownOpen(false);
                }}
              >
                Restaurant Dishes
              </button>
            </div>
          )}
          </div>
          
          <button className="add-dish-button" onClick={() => navigate('/add-dish')}>
            <img src={Icon} alt="Add Dish" className="add-button-icon" />
          </button>
        </div>
      </div>

      {dishes.length === 0 && (
        <p className="placeholder-text">No dishes yet. Add one!</p>
      )}

      <div className="gallery-grid">
        {dishes
          .filter((dish) => {
            if (filterType === 'all') return true;
            if (filterType === 'home') return dish.origin === 'home';
            if (filterType === 'restaurant') return dish.origin === 'restaurant';
            return true;
          })
          .map((dish) => (
          <Link key={dish.id} to={`/dishes/${dish.id}`} className="gallery-link">
            <div className="dish-card">
            
            {/* Image Section */}
            <div className="card-image-container">
              {dish.image_url && (
                <img
                  src={`http://100.117.135.17:3000${dish.image_url}`}
                  alt={dish.dish_name}
                  className="dish-image"
                />
              )}
              <span className="cuisine-badge">{dish.cuisine || "Tasty"}</span>
            </div>

            {/* Content Section */}
            <div className="card-content">
              <h3 className="dish-name">{dish.dish_name}</h3>
              
              <p className="restaurant-info">
                <strong>📍 {dish.restaurant_name}</strong>
              </p>
              
              {/* Address for DB */}
              <p className="restaurant-address">{dish.restaurant_address}</p>
              
              <hr className="divider" />
              
              <p className="dish-description">{dish.dish_details}</p>
            </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}