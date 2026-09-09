// Local HTML files call the local backend. Hosted pages call the API through
// the same HTTPS origin (CloudFront will route API paths to EC2).
window.API_BASE_URL = window.location.protocol === "file:"
    ? "http://localhost:3000"
    : window.location.origin;
