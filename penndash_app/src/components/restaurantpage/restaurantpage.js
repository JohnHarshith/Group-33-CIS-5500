import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaParking, FaWifi, FaWheelchair, FaTv, FaWineGlass, FaUsers, FaDollarSign } from 'react-icons/fa';
import { Wrapper, Header, Section, AmenitiesGrid, AmenityCard, MapContainer, ReviewCard, ReviewSection, ReviewList } from './restaurantpage.styled';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const RestaurantPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const business_id = '0EcCWB9_VxTOoAh_1Wr_RQ'; // Replace this dynamically as needed

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getRestaurantDetails?business_id=${business_id}`);
        setRestaurant(response.data);
      } catch (err) {
        console.error('Failed to fetch restaurant details:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error || !restaurant) return <p>{error || 'No data available'}</p>;

  // Amenities with icons
  const amenities = [
    { name: 'WiFi', available: restaurant.amenities.wifi, icon: <FaWifi /> },
    { name: 'Outdoor Seating', available: restaurant.amenities.outdoor_seating, icon: <FaUsers /> },
    { name: 'Parking Garage', available: restaurant.amenities.parking_garage, icon: <FaParking /> },
    { name: 'Wheelchair Accessible', available: restaurant.amenities.wheelchair_accessible, icon: <FaWheelchair /> },
    { name: 'Has TV', available: restaurant.amenities.has_tv, icon: <FaTv /> },
    { name: 'Alcohol', available: restaurant.amenities.alcohol, icon: <FaWineGlass /> },
    { name: 'Price Range', available: restaurant.amenities.price_range, icon: <FaDollarSign /> },
  ];

  return (
    <Wrapper>
      <Header>
        <h1>{restaurant.restaurant_name}</h1>
        <p>{restaurant.address}</p>
        <p>Average Rating: {restaurant.stars}</p>
      </Header>

      {/* Google Maps Integration */}
      <MapContainer>
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '300px' }}
            center={{ lat: 40.4406, lng: -79.9959 }} // Replace dynamically with real coordinates
            zoom={15}
          >
            <Marker position={{ lat: 40.4406, lng: -79.9959 }} />
          </GoogleMap>
        </LoadScript>
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
            {restaurant.reviews?.map((review, index) => (
               <ReviewCard key={index}>
               <h4>{review.user_name}</h4>
               <p>⭐ {review.review_star}</p>
               <p>{review.review_text}</p>
               </ReviewCard>
            )) || <p>No reviews available.</p>}
         </ReviewList>
      </Section>
    </Wrapper>
  );
};

export default RestaurantPage;