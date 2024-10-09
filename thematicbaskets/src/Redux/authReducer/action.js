import { USER_LOADING } from "../actionTypes";
import axios from "axios";
// let URL = "https://centrum-backend2.vercel.app";
let URL=process.env.REACT_APP_URL
let NewURL = process.env.REACT_APP_NewURL

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



export const managerToken = (data) => (dispatch) => {
  // console.log(NewURL,"New URL")
  dispatch({ type: USER_LOADING });
  return axios.post(
    `${process.env.REACT_APP_NewURL}web-app/manager/generate-token?userId=${data.userId}&password=${data.password}&managerRole=${data.userRole}`
  );
};


export const dealerToken = (data) => (dispatch) => {
  console.log(data,"data")
    dispatch({ type: USER_LOADING });
    return axios.post(
      `${NewURL}web-app/dealer/generate-token?userId=${data.userId}&password=${data.password}`
    );
  };
// Action for OTP verification
export const otpVarificationManager = (data, authToken) => (dispatch) => {
  dispatch({ type: USER_LOADING }); // Dispatch loading state
// console.log(data,"OTP")
// console.log(authToken,"auth token")
  // Make API call to verify the OTP
  return axios.post(
    `${NewURL}web-app/manager/verify-otp?otp=${data.otp}&managerRole=${data.mangerRole}`, 
    {}, // Pass an empty object for the body
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Pass Bearer token for authentication
      },
    }
  );
};



export const otpVarificationDealer = (otp, authToken) => (dispatch) => {
  dispatch({ type: USER_LOADING }); // Dispatch loading state
console.log(otp,"OTP")
console.log(authToken,"auth token")
  // Make API call to verify the OTP
  return axios.post(
    `${NewURL}web-app/dealer/verify-otp?otp=${otp}`, 
    {}, // Pass an empty object for the body
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Pass Bearer token for authentication
      },
    }
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
