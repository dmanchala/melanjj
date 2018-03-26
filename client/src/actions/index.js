import axios from 'axios';
import { FETCH_USER } from './types';

/* eslint import/prefer-default-export: 0 */
export const fetchUser = () => async (dispatch) => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};
