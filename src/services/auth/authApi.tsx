import axios from 'axios';
import { BASE_URL } from '../constants';

interface authUserForm {
  email: string;
  password: string;
}

interface authUserReturn {
  email: string;
  password: string;
  _id: number;
}

// interface TokenType {
//   token: string;
// }

export const authUser = (data: authUserForm): Promise<authUserReturn> => {
  return axios.post(BASE_URL + '/api/fitness/auth/login/', data, {
    headers: { 'Content-Type': '' },
  });
};

export const regUser = ({
  email,
  password,
}: authUserForm): Promise<string> => {
  return axios.post(
    BASE_URL + '/api/fitness/auth/register/',
    {
      email,
      password,
      username: email,
    },
    {
      headers: { 'Content-Type': '' },
    },
  );
};

export const getToken = async ({
  email,
  password,
}: authUserForm): Promise<string> => {
  const res = await axios.post(
    BASE_URL + '/api/fitness/auth/login/',
    { email, password },
    {
      headers: { 'Content-Type': '' },
    },
  );
  return res.data;
};