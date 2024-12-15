import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden; /* Prevents scrolling */
    width: 100%;
    height: 100%;
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
  overflow: hidden; /* Remove scroll bar */
`;

export const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

export const Dropdown = styled.select`
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
  text-align: center;
  background-color: #fff;
`;

export const ChartContainer = styled.div`
  width: ${(props) => (props.small ? '300px' : '100%')};
  max-width: ${(props) => (props.small ? '300px' : '800px')};
  height: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto; /* Center the container */
`;

export const LoadingMessage = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-top: 20px;
  text-align: center;
`;

export const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const Tab = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 1rem;
  color: ${(props) => (props.active ? '#fff' : '#333')};
  background-color: ${(props) => (props.active ? '#333' : '#e0e0e0')}; 
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: ${(props) => (props.active ? '#333' : '#ccc')};
  }
`;