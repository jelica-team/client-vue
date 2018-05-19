export const getJwt = () => {
  return 'bearer ' + localStorage.getItem('example-jwt-jwt');
};

import Api from '@/helpers/Api';

export const register = (email, password) => {
  return Api().post('/seedUser', { email, password })
};

export const login = (email, password) => {
  return Api().post('/auth/getToken', { email, password })
};
