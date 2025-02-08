const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserProfile = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};