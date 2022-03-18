import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:4002/user',
  headers: {
    'Content-type': 'application/json',
  },
});
