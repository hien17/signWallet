import axios from 'axios';

const axiosClient = axios.create();

axiosClient.interceptors.request.use(async(config:any) => {
    config.headers = {
        'content-type': 'application/json',
        ...config.headers,
    },
    config.data
    return config
})

axiosClient.interceptors.response.use((response) => {
    if (response.status === 200 && response.data) {
        return response.data;
    }

    return response;
}, (error) => {
    console.warn(`Bad request, ${error.message}`);
    return Promise.reject(error);
});

export default axiosClient