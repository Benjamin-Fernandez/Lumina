import axios from "axios";
import { apiConfig } from "../config";


// Set up axios defaults from centralized config
axios.defaults.baseURL = apiConfig.baseURL;


// Uncomment for local development:
// axios.defaults.baseURL = "http://localhost:8080";
// axios.defaults.baseURL = "http://192.168.0.114:3000";
// axios.defaults.baseURL = "http://172.20.10.4:3000";


export default axios;




