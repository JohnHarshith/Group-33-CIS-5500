import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FaUser, FaHeart, FaSignOutAlt, FaStar } from 'react-icons/fa';
import {
  Wrapper,
  Header,
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
  StarRatingWrapper,
  Star,
} from './home.styled';

const Home = () => {
  const navigate = useNavigate();
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [username, setUsername] = useState('Guest');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const profileRef = useRef(null);

  const [restaurants, setRestaurants] = useState([]);
  const [totalRestaurants, setTotalRestaurants] = useState(0);

  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 9; // Number of cards per page
  const [favorites, setFavorites] = useState({});
  const amenityOptions = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'parking', label: 'Parking' },
    { value: 'outdoor_seating', label: 'Outdoor Seating' },
  ];

  const [cities, setCities] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:8080/getUniqueCities');
        const data = await response.json();
        setCities(data.cities.map((city) => ({ value: city, label: city })));
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      }
    };

    const fetchCuisines = async () => {
      try {
        const response = await fetch('http://localhost:8080/getUniqueCuisine');
        const data = await response.json();
        setCuisines(data.cuisines.map((cuisine) => ({ value: cuisine, label: cuisine })));
      } catch (err) {
        console.error('Failed to fetch cuisines:', err);
      }
    };

    fetchCities();
    fetchCuisines();
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: restaurantsPerPage,
          city: selectedCity.map((city) => city.value).join(','),
          cuisine: selectedCuisine.map((cuisine) => cuisine.value).join(','),
          amenities: selectedAmenity.map((amenity) => amenity.value).join(','),
          reviews: reviewCount,
          stars: sliderValue,
        });

        const response = await fetch(`http://localhost:8080/getRestaurants`);
        const data = await response.json();
        setRestaurants(data.restaurants);
        setFilteredRestaurants(data.restaurants);
        setTotalRestaurants(data.total); // Assuming the API returns the total count
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      }
    };

    fetchRestaurants();
  }, [currentPage, selectedCity, selectedCuisine, selectedAmenity, reviewCount, sliderValue]);

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

  const handleHeartClick = (id) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],
    }));
  };

  const handleApplyFilters = () => {
    const filtered = restaurants.filter((restaurant) => {
      return (
        (!selectedCity.length || selectedCity.some((city) => city.value === restaurant.city)) &&
        (!selectedCuisine.length || selectedCuisine.some((cuisine) => cuisine.value === restaurant.cuisine)) &&
        (!selectedAmenity.length || selectedAmenity.every((amenity) => restaurant.amenities.includes(amenity.value))) &&
        restaurant.stars >= sliderValue
      );
    });
    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCity([]);
    setSelectedCuisine([]);
    setSelectedAmenity([]);
    setReviewCount(0);
    setSliderValue(0);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    const paginationButtons = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      paginationButtons.push(
        <PageButton
          key={i}
          onClick={() => changePage(i)}
          active={currentPage === i}
        >
          {i}
        </PageButton>
      );
    }

    return (
      <>
        <PageButton onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </PageButton>
        {paginationButtons}
        <PageButton onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
          &gt;
        </PageButton>
      </>
    );
  };

  const renderStars = (stars) => {
    return Array.from({ length: 5 }, (_, i) => <Star key={i} filled={i < stars} />);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const userId = localStorage.getItem('user_id');
      const storedUsername = localStorage.getItem('username');

      if (!userId) {
        navigate('/login');
      } else if (!storedUsername) {
        try {
          const response = await fetch('http://localhost:8080/getUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }),
          });

          if (response.ok) {
            const data = await response.json();
            setUsername(data.username);
            localStorage.setItem('username', data.username);
          } else {
            setUsername('Guest');
          }
        } catch (err) {
          console.error('Failed to fetch username:', err);
          setUsername('Guest');
        }
      } else {
        setUsername(storedUsername);
      }
    };

    fetchUsername();
  }, [navigate]);

  const handleLogout = async () => {
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
      alert('No user logged in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id }),
      });

      if (response.ok) {
        alert('Logout successful.');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        navigate('/logout');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('Failed to log out.');
    }
  };

  const currentRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * restaurantsPerPage,
    currentPage * restaurantsPerPage
  );

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
              options={cities}
              isMulti
              placeholder="Select City"
              value={selectedCity}
              onChange={(selected) => setSelectedCity(selected || [])}
            />
          </SelectWrapper>
          <SelectWrapper>
            <Select
              options={cuisines}
              isMulti
              placeholder="Select Cuisine"
              value={selectedCuisine}
              onChange={(selected) => setSelectedCuisine(selected || [])}
            />
          </SelectWrapper>
          <SelectWrapper>
            <Select
              options={amenityOptions}
              isMulti
              placeholder="Select Amenities"
              value={selectedAmenity}
              onChange={(selected) => setSelectedAmenity(selected || [])}
            />
          </SelectWrapper>
          <SliderWrapper>
            <SliderLabel>Stars: {sliderValue}</SliderLabel>
            <Slider
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseFloat(e.target.value))}
            />
          </SliderWrapper>
          <SliderWrapper>
            <SliderLabel>Review Count: {reviewCount}</SliderLabel>
            <Slider
              type="range"
              min="0"
              max="2000"
              step="100"
              value={reviewCount}
              onChange={(e) => setReviewCount(parseInt(e.target.value))}
            />
          </SliderWrapper>
          <ApplyButton onClick={handleApplyFilters}>Apply Filters</ApplyButton>
          <ApplyButton onClick={resetFilters}>Reset Filters</ApplyButton>
        </Filters>
        <RestaurantList>
          {currentRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.business_id}>
              <IconWrapper>
                <Icon onClick={() => handleHeartClick(restaurant.business_id)} favorite={favorites[restaurant.business_id]}>
                  <FaHeart />
                </Icon>
              </IconWrapper>
              <RestaurantName>{restaurant.name}</RestaurantName>
              <RestaurantDetails>
                <StarRatingWrapper>{renderStars(Math.round(restaurant.stars))}</StarRatingWrapper>
              </RestaurantDetails>
              <RestaurantDetails>Location: {restaurant.city}</RestaurantDetails>
              <RestaurantDetails>Reviews: {restaurant.review_count}</RestaurantDetails>
              <RestaurantDetails>Categories: {restaurant.categories.join(', ')}</RestaurantDetails>
              <RestaurantDetails>
                {restaurant.isOpen ? 'Open Now' : 'Closed'}
              </RestaurantDetails>
            </RestaurantCard>
          ))}
        </RestaurantList>
        <PaginationWrapper>{renderPagination()}</PaginationWrapper>
      </MainContent>
    </Wrapper>
  );
};

export default Home;
