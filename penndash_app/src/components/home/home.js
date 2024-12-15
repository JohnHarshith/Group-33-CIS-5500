import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RcSlider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Select from 'react-select';
import { FaUser, FaHeart, FaSignOutAlt, FaBookmark } from 'react-icons/fa';
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
  const [reviewRange, setReviewRange] = useState([0, 2000]);

  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 9; // Number of cards per page
  const [favorites, setFavorites] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  const [cities, setCities] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  const user_id = localStorage.getItem('user_id');

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
    const fetchBookmarks = async () => {
      const user_id = localStorage.getItem('user_id'); // Get logged-in user's ID
      if (!user_id) return;
  
      try {
        const response = await fetch(`http://localhost:8080/bookmarks?user_id=${user_id}`);
        const data = await response.json(); // Array of business_id
        const bookmarksMap = data.reduce((acc, id) => {
          acc[id] = true; // Mark each business_id as bookmarked
          return acc;
        }, {});
        setBookmarks(bookmarksMap); // Update state with bookmarked businesses
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      }
    };
  
    fetchBookmarks();
  }, []);

  const handleBookmarkClick = async (business_id) => {
    try {
      const user_id = localStorage.getItem('user_id'); // Get logged-in user's ID from local storage
      if (!user_id) {
        console.error('User is not logged in.');
        return;
      }
  
      const isBookmarked = bookmarks[business_id];
      const status = isBookmarked ? null : 'want to visit'; // Toggle status
  
      const response = await fetch('http://localhost:8080/add-userfav-bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, business_id, status }),
      });
  
      if (response.ok) {
        setBookmarks((prev) => ({
          ...prev,
          [business_id]: !isBookmarked,
        }));
      } else {
        console.error('Failed to update bookmark:', await response.json());
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: restaurantsPerPage,
          city: selectedCity.map((city) => city.value).join(','),
          cuisine: selectedCuisine.map((cuisine) => cuisine.value).join(','),
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
            (!selectedCity.length || 
              selectedCity.some((city) => city.value === restaurant.city)) &&
            (!selectedCuisine.length || 
              selectedCuisine.some((cuisine) => cuisine.value === restaurant.cuisine)) &&
            restaurant.stars >= sliderValue &&
            restaurant.review_count >= reviewRange[0] && // Minimum review count
            restaurant.review_count <= reviewRange[1]   // Maximum review count
        );
    });
    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  };


  const resetFilters = () => {
    // Reset states to original values
    setSelectedCity([]);
    setSelectedCuisine([]);
    setSelectedAmenity([]);
    setReviewRange([0, 2000]);
    setSliderValue(0);
    setCurrentPage(1);
  
    // Change the button color to black temporarily
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
      resetButton.style.backgroundColor = 'black';
      resetButton.style.color = 'white';
      resetButton.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
  
    // Optionally revert the color back to its default style after a delay
    setTimeout(() => {
      if (resetButton) {
        resetButton.style.backgroundColor = '';
        resetButton.style.color = '';
      }
    }, 300); // Adjust the delay as needed
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
      {/* Analytics Button */}
      <ApplyButton
      style={{
        marginLeft: '1260px',
        cursor: 'pointer',
        fontSize: '14px',
        padding: '10px 20px',
        borderRadius: '25px', // Rounded corners
        background: 'linear-gradient(90deg, #3b82f6, #9333ea)', // Blue to purple gradient
        color: 'white',
        fontWeight: 'bold',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
        transition: 'transform 0.2s, box-shadow 0.2s', // Smooth hover animations
      }}
      onClick={() => navigate('/analytics')}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      Analytics
    </ApplyButton>
      <Profile ref={profileRef}>
        <ProfileDetails onClick={toggleProfileDropdown}>
          <ProfileName>{username}</ProfileName>
          <Arrow>▼</Arrow>
        </ProfileDetails>
        {profileDropdownVisible && (
          <ProfileDropdown>
            <DropdownItem onClick={() => navigate('/profile')}>
              <FaUser style={{ marginRight: '10px' }} />
              Profile
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/favorites')}>
              <FaHeart style={{ marginRight: '10px' }} />
              Favorites
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/bookmarks')}>
              <FaBookmark style={{ marginRight: '10px' }} />
              Bookmarks
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
            <SliderLabel>Number of Reviews: {`${reviewRange[0]} - ${reviewRange[1]}`}</SliderLabel>
            <RcSlider
              range
              min={0}
              max={2000}
              step={50}
              value={reviewRange}
              onChange={(value) => setReviewRange(value)}
            />
          </SliderWrapper>
          <ApplyButton onClick={handleApplyFilters}>Apply Filters</ApplyButton>
          <ApplyButton id="resetButton" onClick={resetFilters}> Reset Filters</ApplyButton>
        </Filters>
        <RestaurantList>
          {currentRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.business_id}>
              <IconWrapper>
                <Icon 
                  onClick={() => handleHeartClick(restaurant.business_id)} 
                  favorite={favorites[restaurant.business_id]}
                >
                  <FaHeart />
                </Icon>
                <Icon
                  favorite={bookmarks[restaurant.business_id] || false}
                  onClick={() => handleBookmarkClick(restaurant.business_id)}
                >
                  <FaBookmark style={{ color: bookmarks[restaurant.business_id] ? 'blue' : 'lightgray' }}/>
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
