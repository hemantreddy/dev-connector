import axios from "axios";
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'

import { GET_ERRORS, SET_CURRENT_USER } from "./types";



//register user 
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//login - get user token

export const loginUser = userData => dispatch => {
    axios
        .post('/users/login', userData)
        .then(res => {
            //save to local storage
            const { token } = res.data;
            //set token to local storage
            localStorage.setItem('jwtToken', token)
            //set token to auth header
            setAuthToken(token);
            //decode token to get user data
            const decoded = jwt_decode(token);
            //set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => {
            console.log(err)
            dispatch({
                type : GET_ERRORS,
                payload : err.response.data
            });
        });
};

//set login user

export const setCurrentUser = (decoded) => {
    return {
        type : SET_CURRENT_USER,
        payload : decoded
    }
}

//log user out

export const logOutUser = () => dispatch => {
    //remove token from local storage
    localStorage.removeItem('jwtToken');
    //remove authHeader for future requests
    setAuthToken(false)
    //set current user to empty object a&& isauthenticated to false
    dispatch(setCurrentUser({}))
}