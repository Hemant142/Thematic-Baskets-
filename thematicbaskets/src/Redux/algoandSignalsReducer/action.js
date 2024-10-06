import axios from "axios";
import {
  GET_ALGO_REQUEST,
  GET_ALGO_SUCCESS,
  GET_ALGO_FAILURE,
  GET_SIGNAL_REQUEST,
  GET_SIGNAL_SUCCESS,
  GET_SIGNAL_FAILURE,
} from "../actionTypes";

// let URL = "https://centrum-backend2.vercel.app";
let URL="https://centrum.stoq.club/api/backend"



// Fetch algo data
export const fetchAlgo = (token) => async (dispatch) => {
  dispatch({ type: GET_ALGO_REQUEST });
  try {
    const response = await axios.get(`${URL}/get-list/baskets`, {
      headers: { "Access-Token": token },
    });
   
    dispatch({ type: GET_ALGO_SUCCESS, payload: response.data.response.data.reverse() });
  } catch (error) {
    dispatch({ type: GET_ALGO_FAILURE, payload: error.message });
  }
};

// Fetch signal data
export const fetchSignals = (token) => async (dispatch) => {
  dispatch({ type: GET_SIGNAL_REQUEST });
  try {
    const response = await axios.get(`${URL}/get-list/baskets`, {
      headers: { "Access-Token": token },
    });
    dispatch({ type: GET_SIGNAL_SUCCESS, payload: response.data.response.data.reverse()  });
  } catch (error) {
    dispatch({ type: GET_SIGNAL_FAILURE, payload: error.message });
  }
};

// // Post basket data
// export const postBasketData = (dataToSend, token) => async (dispatch) => {
//   try {
//     dispatch({ type: BASKET_REQUEST });
//     const response = await axios.post(`${URL}/create-basket`, dataToSend, {
//       headers: { "Access-Token": token },
//     });
//     if (response.data === 'success') {
//       dispatch(fetchBasket(token)); // Fetch the basket data again after posting new data
//     }
//     return response.data; // Return the response data if needed elsewhere
//   } catch (error) {
//     dispatch({ type: BASKET_FAILURE, payload: error.message });
//     throw new Error(error); // Optionally re-throw the error for further handling
//   }
// };
