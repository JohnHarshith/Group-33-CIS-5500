import React, { useEffect, useState } from 'react';
import {
  Wrapper,
  RestaurantList,
  RestaurantCard,
  RestaurantName,
  RestaurantDetails,
} from './bookmarks.styled';

const Bookmarks = () => {
  const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);
  const user_id = localStorage.getItem('user_id'); // Fetch logged-in user's ID

  // Fetch bookmarks on load
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/bookmarks?user_id=${user_id}`);
        const data = await response.json();
        setBookmarkedRestaurants(data);
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      }
    };

    fetchBookmarks();
  }, [user_id]);

  return (
    <Wrapper>
      <h1>Your Bookmarked Restaurants</h1>
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
