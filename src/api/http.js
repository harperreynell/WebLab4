import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; 

const httpClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

const cache = new Map();
const CACHE_LIFETIME = 5 * 60 * 1000;

httpClient.interceptors.request.use(config => {
    if (config.method === 'get') {
        const url = config.url + (config.params ? JSON.stringify(config.params) : '');
        const cachedResponse = cache.get(url);

        if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_LIFETIME) {
            config.adapter = () => Promise.resolve({
                data: cachedResponse.data,
                status: 200,
                statusText: 'OK (Cached)',
                headers: config.headers,
                config: config,
                request: null,
            });
        }
    }
    return config;
});

httpClient.interceptors.response.use(response => {
    if (response.config.method === 'get' && response.status === 200) {
        const url = response.config.url + (response.config.params ? JSON.stringify(response.config.params) : '');
        cache.set(url, {
            data: response.data,
            timestamp: Date.now(),
        });
    }
    return response;
}, error => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
});


export default httpClient;