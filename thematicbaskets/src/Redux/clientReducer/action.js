import axios from 'axios';
import { CLIENTS_REQUEST, GET_CLIENTS_SUCCESS, CLIENTS_FAILURE } from '../actionTypes';

export const clientsRequest = () => ({
  type: CLIENTS_REQUEST,
});

export const getClientsSuccess = (payload) => ({
  type: GET_CLIENTS_SUCCESS,
  payload,
});

export const clientsFailure = (error) => ({
  type: CLIENTS_FAILURE,
  payload: error,
});

// let url = "https://centrum-backend2.vercel.app";
let url="https://centrum.stoq.club/api/backend"

export const fetchClients = (token) => (dispatch) => {
  dispatch(clientsRequest());

  axios.get(`${url}/client-list/baskets`, {
    headers: { "Access-Token": token },
  })
  .then((response) => {
  console.log(response,"response")
    dispatch(getClientsSuccess(response.data.response));
  })
  .catch((error) => {
    console.error('Error fetching clients:', error);
    dispatch(clientsFailure(error.message));
  });
};

export const postAddToBasket = (dataToSend, token) => async () => {
  
  try {
    const response = await axios.post(`${url}/add-client`, dataToSend, {
      headers: { "Access-Token": token },
    });
 
    // fetchBasketClientList(dataToSend.basketId,token)
    // fetchClients(token)
    return response.data;
  } catch (error) {
    console.error("Error in postAddToBasket:", error.message);
    throw error; // Ensure the error is thrown so it can be caught in handleAddToBasket
  }
};


export const fetchBasketClientList = (basket_id, token) => (dispatch) => {

  return axios.get(`${url}/basket-client-list/baskets?basketId=${basket_id}`, {
    headers: { "Access-Token": token },
  });
};

// <=============================Admin================================>

export const fetchAllClients = (token) => (dispatch) => {
  dispatch(clientsRequest());

  axios.get(`${url}/get-list/client-profile`, {
    headers: { "Access-Token": token },
  })
  .then((response) => {
  
    dispatch(getClientsSuccess(response.data.response.data));
  })
  .catch((error) => {
    
    dispatch(clientsFailure(error.message));
  });
};


export const fetchAllBasketClientList = (basket_id, token) => (dispatch) => {

  return axios.get(`${url}/basket-client-list/admin/baskets?basket_id=${basket_id}`, {
    headers: { "Access-Token": token },
  });
};