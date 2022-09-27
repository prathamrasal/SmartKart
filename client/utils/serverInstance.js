import axios from 'axios';

export const createServerInstance = (token)=>{
    return axios.create({
        baseURL : `http://localhost:5000/api`,
        withCredentials : true,
        params : {
            auth : token || 'test token'
        }
    });
}