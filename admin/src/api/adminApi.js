
import api from './api';

const getAdminToken = () => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    throw new Error('Admin token not found. Please log in again.');
  }

  return token;
};

export const getAdminDashboard = async () => {
  const token = getAdminToken();

  const response = await api.get('/admin/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.data.success) {
    throw new Error(
      response.data.message || 'Failed to load admin dashboard'
    );
  }

  return response.data;
};

export const getAdminConversionHistory = async (
  page = 1,
  limit = 10
) => {
  const token = getAdminToken();

  const response = await api.get('/admin/conversions', {
    params: {
      page,
      limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        'Failed to load admin conversion history'
    );
  }

  return response.data;
};
