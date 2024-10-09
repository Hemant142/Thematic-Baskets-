import axios from "axios";
import { BASKET_REQUEST, GET_BASKET_SUCCESS } from "../actionTypes";

// let URL = "https://centrum-backend2.vercel.app";
// let URL="https://centrum.stoq.club/api/backend"
let URL=process.env.REACT_APP_NewURL

export const getSuccessAction = (payload) => {
  return { type: GET_BASKET_SUCCESS, payload };
};

export const fetchBasket = (token) => (dispatch) => {
  dispatch({ type: BASKET_REQUEST });
  return axios.get(`${URL}web-app/baskets`, {
    headers: {
      Authorization: `Bearer ${token}`, // Pass Bearer token for authentication
    },
  
  });
};


export const postBasketData = (dataToSend, token) => async (dispatch) => {
  console.log(dataToSend,"dataToSend")
  try {
    dispatch({ type: BASKET_REQUEST });
    const response = await axios.post(`${URL}web-app/manager/create-baskets`, dataToSend, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass Bearer token for authentication
      },
    });
    console.log(response,"response.data")
if(response.data!==undefined){

  return response.data; // Return the response data if needed elsewhere
}
  } catch (error) {
    console.log("Error creating basket:", error);
    // return error
    // throw new Error(error); // Optionally re-throw the error for further handling
  }
};

// Corrected fetchSingleBasketData function
export const fetchSingleBasketData = (id, token) => async (dispatch) => {
  // console.log(id, token);
  try {
    const response = await axios.get(`${URL}web-app/single-baskets?basketId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass Bearer token for authentication
      }
    });
    
    // console.log(response.data.data.basketList[0], "fetchSingleBasketData");
    
    return response.data; // Return the data for further processing
  } catch (error) {
    console.log(error, "error");
  }
};

// Edit basket
export const editBasketData =
  (basket_id, token,data) => async (dispatch) => {
console.log(basket_id,token,data)
    try {
      const response = await axios.put(
        `${URL}web-app/manager/edit-baskets?basketId=${basket_id}`,
        data, 
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass Bearer token for authentication
          } 
        }
      );
      if(response.data.success=="success"){
        fetchSingleBasketData(basket_id,token)
      }

      return response.data; // Return the response data if needed elsewhere
    } catch (error) {
      console.error("Error updating basket:", error);
      throw new Error(error); // Optionally re-throw the error for further handling
    }
  };


  export const makeBasketDecision =
  (decision, basket_id, token, researchHeadMessage) => async (dispatch) => {
    console.log("Token:", token);
    console.log("Decision:", decision, "Basket ID:", basket_id, "Reason:", researchHeadMessage);

    try {
      const response = await axios.put(
        `${URL}web-app/manager/make-baskets-decision?basketId=${basket_id}&reason=${researchHeadMessage}&decision=${decision}`,  // Fixed parameter order
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token for authentication
          },
        }
      );

      console.log("Response:", response.data);  // Check the API response

      return response.data; // Return the response data if needed elsewhere
    } catch (error) {
      console.error("Error updating basket:", error.response ? error.response.data : error.message);  // Detailed error logging
      throw new Error(error); // Optionally re-throw the error for further handling
    }
  };


