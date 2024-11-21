// src/axiosInstance.js
import axios from 'axios';
import { useAuth } from './hooks/useAuth';

const useAxios = () => {
  const { token } = useAuth(); // Assuming your AuthContext provides a 'token'

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return axiosInstance;
};

export default useAxios;
