import { USER_LOADING } from "../actionTypes";
import axios from "axios";
// let URL = "https://centrum-backend2.vercel.app";
let URL="https://centrum.stoq.club/api/backend"

export const usersignup = (payload) => (dispatch) => {
  dispatch({ type: USER_LOADING });
  return axios.post("http://localhost:8080/users/register", payload);
};

export const userlogin = (data) => (dispatch) => {

  dispatch({ type: USER_LOADING });
  return axios.post(
    `${URL}/token?username=${data.username}&password=${data.password}&roll=${data.userType}`
  );
};

export const userlogout = (token) => (dispatch) => {
  dispatch({ type: USER_LOADING });

  return axios.get("http://localhost:8080/users/logout", {
    headers: {
      Authorization: token,
    },
  });
};

// export const userforgot = (data)=> (dispatch)=>{
//     dispatch({type:USER_LOADING})
//     return axios.post("http://localhost:8080/users/forgot",data);
// }

// export const usereset = (token,id,data)=> (dispatch)=>{
//     dispatch({type:USER_LOADING})
//     return axios.post(`http://localhost:8080/users/resetpassword/${id}/${token}`,data);
// }
