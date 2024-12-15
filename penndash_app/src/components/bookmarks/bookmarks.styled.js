import styled from 'styled-components';
import { FaMapMarkerAlt, FaPen } from 'react-icons/fa'; // Import icons

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #333;
  color: white;
  padding: 10px 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Profile = styled.div`
  position: relative; /* Position relative for dropdown positioning */
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
`;

export const ProfileDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 40px; /* Adjust based on header height */
  background: white;
  color: black;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 10;

  @media (max-width: 768px) {
    top: 50px; /* Slightly below header for smaller screens */
    right: 10px; /* Padding from the right edge */
    width: 100%; /* Make dropdown full width for better usability */
  }
`;


export const Arrow = styled.div`
  font-size: 12px;
`;

export const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #f0f0f0;
  }
  svg {
    font-size: 16px;
  }
`;

export const MainContent = styled.main`
  padding: 20px;
`;

export const Filters = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SelectWrapper = styled.div`
  flex: 1;
  min-width: 200px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const RestaurantList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;

  .rc-slider {
    width: 200px;
    margin: 0 auto;
  }

  .rc-slider-track {
    background-color: black; /* Change the track color to black */
  }

  .rc-slider-handle {
    border: solid 2px black; /* Change the handle border color */
    background-color: black; /* Change the handle fill color */
  }

  .rc-slider-rail {
    background-color: #ccc; /* Change the rail color */
  }

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
    .rc-slider {
      width: 100%;
    }
  }
`;

export const SliderLabel = styled.div`
  font-size: 14px;
  margin-bottom: 5px;
`;

export const Slider = styled.input`
  width: 200px;
  accent-color: black;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ApplyButton = styled.button`
  background: black;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #333;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
  }
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const PageButton = styled.button`
  background: ${(props) => (props.active ? '#333' : '#f0f0f0')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  border: none;
  border-radius: 3px;
  margin: 0 5px;
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background: #555;
    color: white;
  }
`;

export const TabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

export const Tab = styled.div`
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  background: ${(props) => (props.active ? '#333' : '#f0f0f0')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  &:hover {
    background: #555;
    color: white;
  }
`;

export const StarRatingWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;

export const Star = styled.div`
  font-size: 18px;
  color: ${(props) => {
    if (props.filled) {
      return props.filled >= 4 ? 'green' : props.filled >= 2 ? 'orange' : 'red';
    }
    return '#ccc';
  }};
`;

export const ProfileDetails = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-left: 10px;
`;

export const ProfileName = styled.div`
  margin-right: 10px;
  font-size: 16px;
`;


// Wrapper for restaurant cards
export const Wrapper = styled.div`
  font-family: 'Lato', sans-serif;
  background: #f7f7f7;
  min-height: 100vh;
`;

// Name of the restaurant
export const RestaurantName = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

// Details section (Location, Reviews, etc.)
export const RestaurantDetails = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 6px;
  }
`;

// Categories Wrapper
export const CategoryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

// Pastel colored Category tabs
export const CategoryTab = styled.span`
  background-color: ${(props) =>
    ['#ffdab9', '#b0e0e6', '#ffd1dc', '#e6e6fa', '#f0e68c'][Math.floor(Math.random() * 5)]};
  color: #555;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 15px;
  text-transform: capitalize;
`;

export const RestaurantCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  position: relative; /* Ensures absolute positioning works within */
  overflow: hidden;
  text-align: left;

  &:hover {
    transform: translateY(-5px);
    transition: all 0.3s ease;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
  }
`;

export const RestaurantHeader = styled.div`
  display: flex;
  justify-content: space-between; /* Space between name/closed and icons */
  align-items: center;
`;

export const RestaurantStatus = styled.div`
  color: red;
  font-size: 13px;
`;

export const IconWrapper = styled.div`
  display: flex;
  gap: 10px;
  right: 10px;
  top: 10px;
`;

export const Icon = styled.div`
  cursor: pointer;
  color: ${(props) => (props.bookmarked ? 'blue' : props.favorite ? 'red' : '#ccc')};
  font-size: 20px;

  &:hover {
    transform: scale(1.2);
    transition: 0.2s;
  }
`;

export const CuisineTab = styled.div`
  display: inline-block;
  background-color: black;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 5px;
  margin-top: 5px;
  text-transform: capitalize; /* Makes the text title-case */
`;