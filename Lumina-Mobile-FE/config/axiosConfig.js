import axios from "axios";
import { apiConfig } from "./authConfig";


// Set up axios defaults from config
axios.defaults.baseURL = apiConfig.baseURL;


// Uncomment for local development:
// axios.defaults.baseURL = "http://10.91.53.37:3002";


export default axios;
