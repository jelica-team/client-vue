import Api from './Api';

export const createOrder = (order) => {
  return Api().post('/createOrder', order);
};

export async function getOrders () {
  return await Api().get('/getOrders');
};

export const authenticate = (form) => {
  return Api().post('/public/login', form);
};

export const seedUser = (form) => {
  return Api().post('/public/register/', form);
};

export const getUser = (id) => {
  return Api().get('/user/' + id);
}

export async function takeOrder (params) {
  return await Api().post('/takeOrder', params);
}

export async function getOrdersForUser (id) {
  return await Api().get('/getOrdersForUser/' + id);
}

export const closeOrder = (params) => {
  return Api().post('/close', params);
};

export async function getUnratedOrder (id) {
  return Api().get('/ordersForRate/' + id);
}

export const rateUser = (params) => {
  return Api().post('/rateUser', params);
};

export const deleteOrder = (id, link) => {
  return Api().get('/delete/' + id + '/' + link);
}
