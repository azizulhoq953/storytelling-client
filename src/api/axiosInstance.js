// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: process.env.REACT_APP_API_URL
// });

// axiosInstance.interceptors.request.use(config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, error => {
//     return Promise.reject(error);
// });

// export default axiosInstance;


import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://storytelling-server-w2bm-omiyze2zz-azizuls-projects-69ab18f1.vercel.app'
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;


// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: process.env.REACT_APP_API_URL
// });

// // Log the base URL for confirmation
// console.log('Base URL:', process.env.REACT_APP_API_URL);

// axiosInstance.interceptors.request.use(config => {
//     const token = localStorage.getItem('token');
//     console.log('Token:', token); // Log the token
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, error => {
//     return Promise.reject(error);
// });

// export default axiosInstance;
