
import api from './api';

export const getAllUsers = async () => {
      const token = localStorage.getItem('adminToken');

  const response = await api.get('/users',{
    headers: {
      Authorization: `Bearer ${token}`,
    }
}
);
  return response.data;
};
