import axios from "axios";

const instance = axios.create({baseURL: 'https://us-central1-chatapp-36cba.cloudfunctions.net/app', headers: {
    'Authorization': localStorage.getItem('token'),
    'Access-Control-Allow-Origin': '*'
}});

instance.setToken = (token) => { 
    instance.defaults.headers['Authorization'] = token; 
    localStorage.setItem('token', token);
}

instance.getToken = () => { return (instance.defaults.headers['Authorization']); }

instance.clearToken = () => { 
    instance.defaults.headers['Authorization'] = ""; 
    localStorage.removeItem('token');
}

export default instance;