import Api from './Api';

export const createOrder = (order) => {
  return Api().post('/createOrder', order);
};

export const getOrders = () => {
  return Api().get('/getOrders');
};

export const authenticate = (form) => {
  return Api().post('/public/login', form);
};

export const seedUser = (form) => {
  return Api().post('/public/register/', form);
};

export async function getUser (id) {
  return await Api().get('/user/' + id);
}
