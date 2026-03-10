import api from './api';

export const registerHM = async (data: any) => {
    const response = await api.post('/register_hm', data);
    return response.data;
};

export const createUser = async (data: any, creatorId: number) => {
    const response = await api.post('/create_user', data, {
        params: { creator_id: creatorId }
    });
    return response.data;
};

export const getUsers = async (creatorId: number, search?: string, role?: string) => {
    const response = await api.get('/get_users', {
        params: { creator_id: creatorId, search, role }
    });
    return response.data;
};

export const updateUserStatus = async (user_id: number, status: number, creatorId: number) => {
    const response = await api.put('/update_user_status', { user_id, status }, {
        params: { creator_id: creatorId }
    });
    return response.data;
};

export const getUserProfile = async (userId: number) => {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
};

export const updateUserDetails = async (data: any, creatorId: number) => {
    const response = await api.put('/api/user/update', data, {
        params: { creator_id: creatorId }
    });
    return response.data;
}

export const updateUserProfile = async (userId: number, mobile: string, profilePic?: File) => {
    const formData = new FormData();
    formData.append('mobile', mobile);
    if (profilePic) {
        formData.append('profile_pic', profilePic);
    }

    const response = await api.put(`/api/user/update-profile/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
