import axios from "axios";
import { apiConfig } from "./authConfig";


// Set up axios defaults from config
axios.defaults.baseURL = apiConfig.baseURL;


// Uncomment for local development:
// axios.defaults.baseURL = "http://192.168.0.114:3000";
// axios.defaults.baseURL = "http://172.20.10.4:3002";
// axios.defaults.baseURL = "http://192.168.50.156:3002";


export default axios;





