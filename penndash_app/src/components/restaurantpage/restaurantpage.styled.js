import styled from 'styled-components';

export const Wrapper = styled.div`
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h1 {
    font-size: 2.5em;
    color: #333;
  }

  p {
    margin: 5px 0;
    color: #666;
  }
`;

export const Section = styled.section`
  margin-bottom: 20px;

  h2 {
    font-size: 1.5em;
    color: #555;
    margin-bottom: 10px;
  }
`;

export const MapContainer = styled.div`
  margin: 20px 0;
`;

export const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
`;

export const AmenityCard = styled.div`
  background-color: ${(props) => (props.available ? '#e0ffe0' : '#ffe0e0')};
  border: 1px solid ${(props) => (props.available ? '#a0e0a0' : '#e0a0a0')};
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => (props.available ? '#006400' : '#8b0000')};

  svg {
    font-size: 24px;
    margin-bottom: 5px;
  }
`;

export const ReviewList = styled.div`
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

export const ReviewCard = styled.div`
  background-color: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  h4 {
    margin: 0 0 10px;
    font-size: 1.2em;
    color: #333;
  }

  p {
    margin: 5px 0;
    color: #555;
  }
`;

