import styled from 'styled-components';

export const LoginRegisterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Lato', sans-serif;
  overflow: hidden;
`;

export const FormContainer = styled.div`
  background: white;
  width: 350px;
  padding: 20px;
  margin-top: -160px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: all 0.4s ease-in-out;
`;

export const TabWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const Tab = styled.button`
  flex: 1;
  padding: 10px 0;
  font-size: 16px;
  color: ${({ active }) => (active ? 'white' : '#333')};
  background: ${({ active }) => (active ? '#333' : 'transparent')};
  border: none;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  border-radius: ${({ active }) => (active ? '15px 15px 0 0' : 'none')};
  &:hover {
    background: ${({ active }) => (active ? '#555' : '#f0f0f0')};
  }
`;

export const Input = styled.input`
  width: 42vh;
  padding: 10px;
  margin: 10px 0;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  outline: none;
`;

export const ForgotPassword = styled.a`
  font-size: 12px;
  color: #1e90ff;
  text-decoration: none;
  margin-bottom: 15px;
  display: block;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #333;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  &:hover {
    background: #555;
  }
`;

export const IconButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #e0e0e0;
  }
  svg {
    flex-shrink: 0;
  }
`;

export const SwitchText = styled.p`
  font-size: 14px;
  margin-top: 15px;
  color: #666;
  a {
    color: #1e90ff;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;
