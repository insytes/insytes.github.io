import axios from 'axios';
import { state } from './store';

const http = axios.create();
http.defaults.baseURL = 'https://snooker.test/api';
http.defaults.headers.common = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};
http.defaults.timeout = 2000;
http.defaults.withCredentials = true;

export const login = (email: string, password: string) => {
  const request = http.post('/token', { email, password, device_name: 'test' })
  request.then(res => {
    http.defaults.headers.common.Authorization = `Bearer ${res.data.token}`
  })
  return request;
}

export const logout = () => http.defaults.headers.common.Authorization = undefined;

export const getUser = () => http.get('/user')
