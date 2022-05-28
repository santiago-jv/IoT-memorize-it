import axios from "axios";
let http;

http = axios.create ({
    baseURL:'http://localhost:8080',
    
})

export default http