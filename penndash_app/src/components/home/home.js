import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { FaUser, FaHeart, FaList, FaSignOutAlt, FaStar } from 'react-icons/fa';
import {
  Wrapper,
  Header,
  Logo,
  Profile,
  ProfileDetails,
  ProfileName,
  Arrow,
  ProfileDropdown,
  DropdownItem,
  MainContent,
  Filters,
  SelectWrapper,
  SliderWrapper,
  SliderLabel,
  Slider,
  ApplyButton,
  RestaurantList,
  RestaurantCard,
  RestaurantName,
  RestaurantDetails,
  PaginationWrapper,
  PageButton,
  IconWrapper,
  Icon,
} from './home.styled';

const Home = () => {
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [username, setUsername] = useState('');
  const profileRef = useRef(null);

  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedReviewCount, setSelectedReviewCount] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [restaurants] = useState([
   { id: 1, name: 'Restaurant A', location: 'New York', stars: 5, amenities: ['WiFi'], reviews: 150, cuisine: 'Italian' },
   { id: 2, name: 'Restaurant B', location: 'Los Angeles', stars: 4, amenities: ['Parking'], reviews: 200, cuisine: 'Chinese' },
   { id: 3, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
   { id: 4, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
   { id: 5, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
   { id: 6, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
   { id: 7, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
   { id: 8, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
   { id: 9, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
   { id: 10, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
   { id: 11, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
   { id: 12, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
   { id: 13, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
   { id: 14, name: 'Restaurant A', location: 'New York', stars: 5, amenities: ['WiFi'], reviews: 150, cuisine: 'Italian' },
   { id: 15, name: 'Restaurant B', location: 'Los Angeles', stars: 4, amenities: ['Parking'], reviews: 200, cuisine: 'Chinese' },
   { id: 16, name: 'Restaurant C', location: 'New York', stars: 3, amenities: ['WiFi'], reviews: 100, cuisine: 'Mexican' },
  ]);

  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 9;
  const [favorites, setFavorites] = useState({});
  const [highlightedStars, setHighlightedStars] = useState({});

  // Handle Dropdown Visibility
  const toggleProfileDropdown = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };

  const handleOutsideClick = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Handle Favorite and Highlight
  const handleHeartClick = (id) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],
    }));
  };

  const handleStarClick = (id) => {
    setHighlightedStars((prevStars) => ({
      ...prevStars,
      [id]: !prevStars[id],
    }));
  };

  // Apply Filters
  const handleApplyFilters = () => {
    const filtered = restaurants.filter((restaurant) => {
      return (
        (!selectedCity.length || selectedCity.some((city) => city.label.toLowerCase() === restaurant.location.toLowerCase())) &&
        (!selectedAmenities.length || selectedAmenities.every((amenity) => restaurant.amenities.includes(amenity.label))) &&
        (!selectedReviewCount.length || selectedReviewCount.some((review) => parseInt(review.value) <= restaurant.reviews)) &&
        (!selectedCuisine.length || selectedCuisine.some((cuisine) => cuisine.label === restaurant.cuisine)) &&
        restaurant.stars >= sliderValue
      );
    });
    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  };

  // Reset Filters
  const resetFilters = () => {
    setSelectedCity([]);
    setSelectedAmenities([]);
    setSelectedReviewCount([]);
    setSelectedCuisine([]);
    setSliderValue(0);
    setFilteredRestaurants(restaurants);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Load username from local storage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername('Guest');
    }
  }, []);

  const handleLogout = async () => {
    try {
      const storedUsername = localStorage.getItem('username');
      if (!storedUsername) {
        alert('No user logged in.');
        return;
      }

      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: storedUsername }),
      });

      if (response.ok) {
        alert('Logged out successfully.');
        localStorage.removeItem('username'); // Remove username from local storage
        window.location.href = '/logout';
      } else {
        const error = await response.json();
        alert(`Failed to log out: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Failed to log out.');
    }
  };

  return (
    <Wrapper>
      <Header>
        <Profile ref={profileRef}>
          <ProfileDetails onClick={toggleProfileDropdown}>
            <ProfileName>{username}</ProfileName>
            <Arrow>▼</Arrow>
          </ProfileDetails>
          {profileDropdownVisible && (
            <ProfileDropdown>
              <DropdownItem>
                <FaUser style={{ marginRight: '10px' }} />
                Profile
              </DropdownItem>
              <DropdownItem>
                <FaHeart style={{ marginRight: '10px' }} />
                Favorites
              </DropdownItem>
              <DropdownItem>
                <FaList style={{ marginRight: '10px' }} />
                My List
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                <FaSignOutAlt style={{ marginRight: '10px' }} />
                Logout
              </DropdownItem>
            </ProfileDropdown>
          )}
        </Profile>
      </Header>
      <MainContent>
        <Filters>
          <SelectWrapper>
            <Select
              options={[{ value: 'new york', label: 'New York' }, { value: 'los angeles', label: 'Los Angeles' }]}
              isMulti
              placeholder="Select City"
              value={selectedCity}
              onChange={(selected) => setSelectedCity(selected || [])}
            />
          </SelectWrapper>
          <SelectWrapper>
            <Select
              options={[
                { value: 'wifi', label: 'WiFi' },
                { value: 'parking', label: 'Parking' },
              ]}
              isMulti
              placeholder="Select Amenities"
              value={selectedAmenities}
              onChange={(selected) => setSelectedAmenities(selected || [])}
            />
          </SelectWrapper>
          <SelectWrapper>
            <Select
              options={[
                { value: '100', label: '100+' },
                { value: '200', label: '200+' },
              ]}
              isMulti
              placeholder="Select Review Count"
              value={selectedReviewCount}
              onChange={(selected) => setSelectedReviewCount(selected || [])}
            />
          </SelectWrapper>
          <SelectWrapper>
            <Select
              options={[
                { value: 'italian', label: 'Italian' },
                { value: 'chinese', label: 'Chinese' },
                { value: 'mexican', label: 'Mexican' },
              ]}
              isMulti
              placeholder="Select Cuisine"
              value={selectedCuisine}
              onChange={(selected) => setSelectedCuisine(selected || [])}
            />
          </SelectWrapper>
          <SliderWrapper>
            <SliderLabel>Stars: {sliderValue}</SliderLabel>
            <Slider type="range" min="0" max="5" step="0.5" value={sliderValue} onChange={(e) => setSliderValue(parseFloat(e.target.value))} />
          </SliderWrapper>
          <ApplyButton onClick={handleApplyFilters}>Apply Filters</ApplyButton>
          <ApplyButton onClick={resetFilters}>Reset Filters</ApplyButton>
        </Filters>
        <RestaurantList>
          {currentRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id}>
              <IconWrapper>
                <Icon onClick={() => handleHeartClick(restaurant.id)} favorite={favorites[restaurant.id]}>
                  <FaHeart />
                </Icon>
                <Icon onClick={() => handleStarClick(restaurant.id)} highlight={highlightedStars[restaurant.id]}>
                  <FaStar />
                </Icon>
              </IconWrapper>
              <RestaurantName>{restaurant.name}</RestaurantName>
              <RestaurantDetails>Location: {restaurant.location}</RestaurantDetails>
              <RestaurantDetails>Stars: {restaurant.stars}</RestaurantDetails>
            </RestaurantCard>
          ))}
        </RestaurantList>
        <PaginationWrapper>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton key={i + 1} onClick={() => changePage(i + 1)} active={currentPage === i + 1}>
              {i + 1}
            </PageButton>
          ))}
        </PaginationWrapper>
      </MainContent>
    </Wrapper>
  );
};

export default Home;