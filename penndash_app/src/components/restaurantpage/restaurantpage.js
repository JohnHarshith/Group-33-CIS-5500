import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaParking, FaWifi, FaWheelchair, FaTv, FaWineGlass, FaUsers, FaDollarSign } from 'react-icons/fa';
import { Wrapper, Header, Section, AmenitiesGrid, AmenityCard, MapContainer, ReviewCard, ReviewSection, ReviewList } from './restaurantpage.styled';
import { GoogleMap, MarkerF, LoadScript } from '@react-google-maps/api';

const RestaurantPage = () => {
  const location = useLocation();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const business_id = 'xoA1_vsxC0xD_fPgDZ2mbg'; // Replace dynamically as needed

  useEffect(() => {
    console.log(location.state?.business_id)
    const fetchData = async () => {
      try {
        const [restaurantResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/getRestaurantSummary?business_id=${location.state?.business_id}`),
          axios.get(`http://localhost:8080/getReviewsByBusinessId?business_id=${location.state?.business_id}`),
        ]);
        console.log(restaurantResponse.data);
        setRestaurant(restaurantResponse.data);
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error || !restaurant) return <p>{error || 'No data available'}</p>;

  const getCuisineImage = (cuisine) => {
    // Default to 'default.png' if the cuisine is undefined
    const folderName = cuisine?.toLowerCase().replace(/\s+/g, '-') || 'default';
    const randomImageNumber = Math.floor(Math.random() * 3) + 1; // Random image between 1-3
    return `/images/cuisines/${folderName}/${randomImageNumber}.jpg`;
  };

  // Amenities with icons
  const amenities = [
    { name: 'WiFi', available: restaurant.amenities?.wifi, icon: <FaWifi /> },
    { name: 'Outdoor Seating', available: restaurant.amenities?.outdoor_seating, icon: <FaUsers /> },
    { name: 'Parking Garage', available: restaurant.amenities?.parking_garage || restaurant.amenities?.parking_validated || restaurant.amenities?.parking_street || restaurant.amenities?.parking_lot, icon: <FaParking /> },
    { name: 'Wheelchair Accessible', available: restaurant.amenities?.wheelchair_accessible, icon: <FaWheelchair /> },
    { name: 'Has TV', available: restaurant.amenities?.has_tv, icon: <FaTv /> },
    { name: 'Alcohol', available: restaurant.amenities?.alcohol, icon: <FaWineGlass /> },
    { name: 'Price Range', available: restaurant.amenities?.price_range, icon: <FaDollarSign /> },
  ];

  return (
    <Wrapper>
      <Header>
      <img
          src={getCuisineImage(restaurant.cuisine)}
          alt={restaurant.cuisine}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '10px 10px 10px 10px',
          }}
        />
        <h1>{restaurant.restaurantName}</h1>
        <p>{restaurant.address}</p>
        <p>Average Rating: {restaurant.avgRating}</p>
        <p>{restaurant.isOpen ? 'Open Now' : 'Closed'}</p>
      </Header>

      {/* Google Maps Integration */}
      <MapContainer>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '300px' }}
            center={{ lat: parseFloat(restaurant.latitude), lng: parseFloat(restaurant.longitude) }} // Replace dynamically with real coordinates
            zoom={15}
          >
            <MarkerF position={{ lat: parseFloat(restaurant.latitude), lng: parseFloat(restaurant.longitude) }} />
          </GoogleMap>
      </MapContainer>

      {/* Categories */}
      <Section>
        <h2>Categories</h2>
        <p>{restaurant.categories?.join(', ') || 'No categories available'}</p>
      </Section>

      {/* Amenities */}
      <Section>
        <h2>Amenities</h2>
        <AmenitiesGrid>
          {amenities.map((amenity, index) => (
            <AmenityCard key={index} available={amenity.available}>
              {amenity.icon}
              <span>{amenity.name}</span>
            </AmenityCard>
          ))}
        </AmenitiesGrid>
      </Section>

      {/* Reviews */}
      <Section>
        <h2>Reviews</h2>
        <ReviewList>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <ReviewCard key={index}>
                <h4>{review.reviewerName}</h4>
                <p>⭐ {review.rating}</p>
                <p>{review.content}</p>
                <p><small>{new Date(review.date).toLocaleDateString()}</small></p>
              </ReviewCard>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </ReviewList>
      </Section>
    </Wrapper>
  );
};

export default RestaurantPage;
