import axios from 'axios';
import URL from './address';

export default() => {
  return axios.create({
    baseURL: URL
  })
}
