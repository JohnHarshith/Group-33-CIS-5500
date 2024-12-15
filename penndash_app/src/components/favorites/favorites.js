import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPen, FaHeart, FaBookmark, FaRegStar, FaStar } from 'react-icons/fa';
import {
  Wrapper,
  RestaurantList,
  RestaurantCard,
  RestaurantName,
  RestaurantDetails,
  CuisineTab,
  CategoryTab,
  CategoryWrapper,
  RestaurantHeader,
  RestaurantStatus,
  IconWrapper,
  Icon,
  StarRatingWrapper,
} from './favorites.styled';

const Favorites = () => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const user_id = localStorage.getItem('user_id'); // Fetch logged-in user's ID

  // Fetch favorites on load
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:8080/favorites?user_id=${user_id}`);
        const data = await response.json();
        setFavoriteRestaurants(data);
        const favoritesMap = {};
        data.forEach((restaurant) => {
          favoritesMap[restaurant.business_id] = true;
        });
        setFavorites(favoritesMap);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      }
    };

    const fetchBookmarks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/bookmarks?user_id=${user_id}`);
        const data = await response.json();
        const bookmarksMap = {};
        data.forEach((restaurant) => {
          bookmarksMap[restaurant.business_id] = true;
        });
        setBookmarks(bookmarksMap);
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      }
    };

    fetchFavorites();
    fetchBookmarks();
  }, [user_id]);

  // Handle favorite and bookmark toggle
  const toggleFavorite = async (business_id) => {
    const isFavorite = favorites[business_id];
    const status = isFavorite ? null : 'favorite';

    try {
      await fetch('http://localhost:8080/add-userfav-bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, business_id, status }),
      });
      setFavorites((prev) => ({ ...prev, [business_id]: !isFavorite }));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const toggleBookmark = async (business_id) => {
    const isBookmarked = bookmarks[business_id];
    const status = isBookmarked ? null : 'want to visit';

    try {
      await fetch('http://localhost:8080/add-userfav-bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, business_id, status }),
      });
      setBookmarks((prev) => ({ ...prev, [business_id]: !isBookmarked }));
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  // Generate image path based on cuisine
  const getCuisineImage = (cuisine) => {
    const folderName = cuisine?.toLowerCase().replace(/\s+/g, '-') || 'default';
    const randomImageNumber = Math.floor(Math.random() * 3) + 1; // Random image 1-3
    return `/images/cuisines/${folderName}/${randomImageNumber}.jpg`;
  };

  // Render stars based on rating
  const renderStars = (stars) => {
    const totalStars = 5;
    const filledStars = Math.round(stars);
    return (
      <StarRatingWrapper>
        {Array.from({ length: totalStars }).map((_, index) => (
          <span key={index}>
            {index < filledStars ? (
              <FaStar style={{ color: '#fcb900' }} />
            ) : (
              <FaRegStar style={{ color: '#ccc' }} />
            )}
          </span>
        ))}
      </StarRatingWrapper>
    );
  };

  return (
    <Wrapper>
      <h1>Your Favorite Restaurants</h1>
      {favoriteRestaurants.length > 0 ? (
        <RestaurantList>
          {favoriteRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.business_id}>
              {/* Restaurant Image */}
              <img
                src={getCuisineImage(restaurant.cuisine)}
                alt={restaurant.cuisine}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '10px 10px 0 0',
                }}
              />
              {/* Header */}
              <RestaurantHeader>
                <div>
                  <RestaurantName>
                    {restaurant.name.replace(/['"]+/g, '')}
                    <RestaurantStatus>{restaurant.isOpen ? '' : 'Closed'}</RestaurantStatus>
                  </RestaurantName>
                </div>
                <IconWrapper>
                  <Icon onClick={() => toggleFavorite(restaurant.business_id)}>
                    <FaHeart
                      style={{ color: favorites[restaurant.business_id] ? 'red' : 'lightgray' }}
                    />
                  </Icon>
                  <Icon onClick={() => toggleBookmark(restaurant.business_id)}>
                    <FaBookmark
                      style={{ color: bookmarks[restaurant.business_id] ? 'blue' : 'lightgray' }}
                    />
                  </Icon>
                </IconWrapper>
              </RestaurantHeader>

              {/* Restaurant Details */}
              <RestaurantDetails>
                <FaMapMarkerAlt style={{ marginRight: '8px', color: '#3b82f6' }} />
                {restaurant.city || 'N/A'}
              </RestaurantDetails>
              <RestaurantDetails>
                <FaPen style={{ marginRight: '8px', color: '#9333ea' }} />
                {restaurant.review_count || 0} Reviews
              </RestaurantDetails>
              <RestaurantDetails>{renderStars(restaurant.stars || 0)}</RestaurantDetails>

              {/* Cuisine and Category Tabs */}
              <CategoryWrapper>
                {restaurant.cuisine && <CuisineTab>{restaurant.cuisine}</CuisineTab>}
                {(restaurant.categories || []).map((category, index) => (
                  <CategoryTab key={index}>{category}</CategoryTab>
                ))}
              </CategoryWrapper>
            </RestaurantCard>
          ))}
        </RestaurantList>
      ) : (
        <p>No favorite restaurants found.</p>
      )}
    </Wrapper>
  );
};

export default Favorites;