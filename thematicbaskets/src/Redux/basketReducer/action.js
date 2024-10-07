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

export const updateBasketData =
  (decision, basket_id, token,researchHeadMessage) => async (dispatch) => {

    try {
      const response = await axios.post(
        `${URL}/permitions/baskets?basket_id=${basket_id}&basket_decision=${decision}&rejection_reason=${researchHeadMessage}`,
        {researchHeadMessage}, 
        {
          headers: { "Access-Token": token }, // <-- Headers configuration
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


