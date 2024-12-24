const axios = require("axios");

// Set up axios defaults
// axios.defaults.baseURL = "http://192.168.0.114:3000";
// axios.defaults.baseURL = "http://172.20.10.4:3002";
axios.defaults.baseURL = "http://192.168.1.28:3002";
// axios.defaults.baseURL = "http://192.168.50.156:3002";

module.exports = axios;
