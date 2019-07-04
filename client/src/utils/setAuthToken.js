import axios from 'axios';

const setAuthToken = (token) => {
    if(token){
        //apply to every request
        axios.default.headers.common['Authorization'] = token;
    } else {
        //delete auth header
        delete axios.default.headers.common['Authorization'];
    }
}

export default setAuthToken;