import styled from 'styled-components';

export const LogoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
`;

export const Message = styled.h1`
  color: #333;
  font-size: 24px;
  margin-top: -190px;
`;

export const LoginButton = styled.button`
  background: black;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #333;
  }
`;
