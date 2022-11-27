import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { getAccessToken } from '../utils/token-config';
import { actions as authActions } from '../redux/authenticate/slice';
import axiosConfig from '../utils/axios';

export function useDecodeToken() {
  const dispatch = useDispatch();
  const { data: currentUser, isLoading: isDecodingToken } = useQuery(
    ['decodeToken'],
    async () => {
      let accessToken = '';
      const token = await getAccessToken();
      if (token) {
        accessToken = token;
      }
      const response = await axiosConfig.get('Authenticate/decode-token', { headers: { jwttoken: accessToken } });
      dispatch(authActions.setAuthenticated(true));
      return response.data;
    },
    {
      onError: () => {
        dispatch(authActions.setAuthenticated(false));
        console.log('error decode token');
      },
    },
  );

  console.log('user', currentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(authActions.setUser(currentUser));
    }
  }, [currentUser]);
  return isDecodingToken;
}
