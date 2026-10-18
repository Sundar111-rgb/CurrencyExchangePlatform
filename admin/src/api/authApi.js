
import api from './api';

export const loginAdmin = async (email, password) => {
  const response = await api.post('/auth/login', {
    email: email.trim(),
    password,
  });

  const data = response.data;

  if (!data.success || !data.token || !data.user) {
    throw new Error(data.message || 'Login failed');
  }

  // Only admin accounts can access the admin dashboard.
  if (data.user.role !== 'admin') {
    throw new Error('Access denied. Admin account required.');
  }

  localStorage.setItem('adminToken', data.token);
  localStorage.setItem('adminUser', JSON.stringify(data.user));

  return data.user;
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  localStorage.removeItem('token');
};
