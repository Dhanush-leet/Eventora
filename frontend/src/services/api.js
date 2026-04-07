import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Auto-refresh token on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest)).catch(err => Promise.reject(err));
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                await api.post('/api/auth/refresh');
                processQueue(null);
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

// ========================
// Event APIs
// ========================

export const fetchEvents = (params = {}) =>
    api.get('/api/events', { params }).then(r => r.data);

export const fetchEventById = (id) =>
    api.get(`/api/events/${id}`).then(r => r.data);

export const fetchFeaturedEvents = () =>
    api.get('/api/events/featured').then(r => r.data);

export const fetchEventFilters = () =>
    api.get('/api/events/filters').then(r => r.data);

// ========================
// Movies APIs
// ========================

export const fetchMovies = (location = '') =>
    api.get('/api/movies', { params: { location } }).then(r => r.data);

export const fetchMovieTheatres = (movieId) =>
    api.get(`/api/movies/${movieId}/theatres`).then(r => r.data);

// ========================
// Seat APIs
// ========================

export const fetchSeats = (eventId) =>
    api.get(`/api/events/${eventId}/seats`).then(r => r.data);

export const lockSeats = (eventId, seatIds) =>
    api.post(`/api/events/${eventId}/seats/lock`, { seatIds }).then(r => r.data);

export const unlockSeats = (eventId, seatIds) =>
    api.post(`/api/events/${eventId}/seats/unlock`, { seatIds }).then(r => r.data);

// ========================
// Booking APIs
// ========================

export const createBooking = (eventId, seatIds) =>
    api.post('/api/bookings', { eventId, seatIds }).then(r => r.data);

export const fetchMyBookings = () =>
    api.get('/api/bookings/my').then(r => r.data);

export const fetchBookingById = (id) =>
    api.get(`/api/bookings/${id}`).then(r => r.data);

export const cancelBooking = (id) =>
    api.post(`/api/bookings/${id}/cancel`).then(r => r.data);

// ========================
// User APIs
// ========================

export const fetchProfile = () =>
    api.get('/api/user/profile').then(r => r.data);

export const logout = () =>
    api.post('/api/user/logout').then(r => r.data);

export default api;
