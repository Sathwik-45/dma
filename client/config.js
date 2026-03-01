const CONFIG = {
    // If the site is running on localhost, use the local backend.
    // Replace 'https://your-backend-live-url.com' with your actual backend URL once deployed.
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://dma-eg2y.onrender.com/api' // Place your live URL here
};
