import React, { useEffect, useState } from 'react';
import { Wrapper, RestaurantList, RestaurantCard, RestaurantName, RestaurantDetails } from './bookmarks.styled';

const Bookmarks = () => {
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const user_id = localStorage.getItem('user_id'); // Logged-in user's ID

      try {
        const response = await fetch(`http://localhost:8080/bookmarks?user_id=${user_id}`);
        const data = await response.json();
        setBookmarkedRestaurants(data); // API returns the bookmarked restaurant details
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <Wrapper>
      <h1>Bookmarks</h1>
      {bookmarkedRestaurants.length > 0 ? (
        <RestaurantList>
          {bookmarkedRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.business_id}>
              <RestaurantName>{restaurant.name}</RestaurantName>
              <RestaurantDetails>Location: {restaurant.city}</RestaurantDetails>
              <RestaurantDetails>Reviews: {restaurant.review_count}</RestaurantDetails>
              <RestaurantDetails>Stars: {restaurant.stars}</RestaurantDetails>
            </RestaurantCard>
          ))}
        </RestaurantList>
      ) : (
        <p>No bookmarks found.</p>
      )}
    </Wrapper>
  );
};

export default Bookmarks;