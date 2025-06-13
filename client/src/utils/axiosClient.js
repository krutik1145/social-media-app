import axios from 'axios';
import { getItem, removeItem, setItem } from './localStorageManager';
import store from "../redux/Store";
import { setLoading, showToast } from '../redux/slices/appConfigSlice';
import { TOAST_FAILURE } from '../App';
const KEY_ACCESS_TOKEN = 'accessToken';

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
  
});



axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN); 
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  store.dispatch(setLoading(true));
  return request; 
});

axiosClient.interceptors.response.use(
async (response) => { 
    store.dispatch(setLoading(false));
const data = response.data;
 if (data.status === 'ok') {
      return data;
    } 

    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.message;
    
  store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error,
      })
    );


 if (
      statusCode === 401 &&
      originalRequest.url === `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
    ) {
      removeItem(KEY_ACCESS_TOKEN);
      window.location.replace('/login', '_self');
      return Promise.reject(error);
    }
     

    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axiosClient.get('/auth/refresh');
        

        if (
          refreshResponse.status === 200 &&
          refreshResponse.data.status === 'ok'
        ) {
          const newAccessToken = refreshResponse.data.result.accessToken;
          setItem(KEY_ACCESS_TOKEN, newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        }
      
      } catch (e) {
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace('/login', '_self');
        return Promise.reject(e);
      }
    }
  console.log(('axios error ',error));
  
    return Promise.reject(error);
  },
  async(error)=>{
      store.dispatch(setLoading(false));
     store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error.message,
      })
    );
    return Promise.reject(error);
  }
);   






