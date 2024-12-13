import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden; /* Disables scrolling */
    height: 100%; /* Ensures the height is 100% of the viewport */
  }
`;

export const Wrapper = styled.div`
  font-family: 'Lato', sans-serif;
  background: #f7f7f7;
  min-height: 100vh;
`;

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

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

export const Profile = styled.div`
  position: relative;
`;

export const Arrow = styled.div`
  font-size: 12px;
`;

export const ProfileDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
  background: white;
  color: black;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 10; /* Ensure dropdown appears above other elements */
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

export const RestaurantCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  margin: 0 auto;
  position: relative; /* Ensure icons can be positioned absolutely */
`;

export const RestaurantName = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const RestaurantDetails = styled.div`
  font-size: 14px;
  color: #555;
`;

export const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
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

export const IconWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
`;

export const Icon = styled.div`
  cursor: pointer;
  color: ${(props) => (props.favorite ? 'red' : props.highlight ? 'gold' : '#ccc')};
  font-size: 20px;
  &:hover {
    transform: scale(1.2);
  }
`;

export const ProfileDetails = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-left: 10px; /* Add padding to shift "John Doe" left */
`;

export const ProfileName = styled.div`
  margin-right: 10px;
  font-size: 16px; /* Adjust size if necessary */
`;
