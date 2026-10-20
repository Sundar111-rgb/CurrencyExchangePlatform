import api from './api';

export const getAdminDashboard = async () => {
  const token = localStorage.getItem('adminToken');

  console.log('Admin token exists:', Boolean(token));

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

  console.log('Dashboard response:', response.data);

  return response.data;
};
