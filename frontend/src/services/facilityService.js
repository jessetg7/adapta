import axios from 'axios';

const API_URL = '/api/facilities';

export const facilityService = {
    getFacilities: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching facilities:', error);
            throw error;
        }
    },

    getFacilityStaff: async (facilityId) => {
        try {
            const response = await axios.get(`${API_URL}/${facilityId}/staff`);
            return response.data;
        } catch (error) {
            console.error('Error fetching facility staff:', error);
            throw error;
        }
    }
};

export default facilityService;
