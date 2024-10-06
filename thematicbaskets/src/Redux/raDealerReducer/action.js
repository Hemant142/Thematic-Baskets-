import axios from "axios";
import {
  GET_RESEARCH_ANALYSTS_REQUEST,
  GET_RESEARCH_ANALYSTS_SUCCESS,
  GET_RESEARCH_ANALYSTS_FAILURE,
  GET_DEALERS_REQUEST,
  GET_DEALERS_SUCCESS,
  GET_DEALERS_FAILURE,
  POST_RESEARCH_ANALYST_REQUEST,
  POST_RESEARCH_ANALYST_SUCCESS,
  POST_RESEARCH_ANALYST_FAILURE,
  POST_DEALER_REQUEST,
  POST_DEALER_SUCCESS,
  POST_DEALER_FAILURE
} from "../actionTypes";

// const apiUrl = "https://centrum-backend2.vercel.app"; 
let apiUrl="https://centrum.stoq.club/api/backend"

// GET researchAnalysts
export const getResearchAnalysts = (token) => async (dispatch) => {
  dispatch({ type: GET_RESEARCH_ANALYSTS_REQUEST });
  try {
    const response = await axios.get(`${apiUrl}/get-list/manager-profile?roll_information=research analyst`, {
      headers: { "Access-Token": token },
    });
  
    dispatch({ type: GET_RESEARCH_ANALYSTS_SUCCESS, payload: response.data.response.data });
  } catch (error) {
    console.log(error,"getResearchAnalysts Error")
    dispatch({ type: GET_RESEARCH_ANALYSTS_FAILURE, payload: error.message });
  }
};

// GET dealers
export const getDealers = (token) => async (dispatch) => {
  dispatch({ type: GET_DEALERS_REQUEST });
  try {
    const response = await axios.get(`${apiUrl}/get-list/dealer-profile?roll_information=dealer`, {
      headers: { "Access-Token": token },
    });
    dispatch({ type: GET_DEALERS_SUCCESS, payload: response.data.response.data });
  } catch (error) {
    console.log(error,"error getDealers")
    dispatch({ type: GET_DEALERS_FAILURE, payload: error.message });
  }
};

// POST researchAnalyst
export const postResearchAnalystAndDealer = (data, token) => async (dispatch) => {
  dispatch({ type: POST_RESEARCH_ANALYST_REQUEST });
  try {
    const response = await axios.post(`${apiUrl}/create-manager`, data, {
      headers: { "Access-Token": token },
    });
    if(response.data.status=="success"){
      getDealers(token)
      getResearchAnalysts(token)
    }
    return response.data;
    // dispatch({ type: POST_RESEARCH_ANALYST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: POST_RESEARCH_ANALYST_FAILURE, payload: error.message });
  }
};

export const updateStatus = (id,status, token) => async (dispatch) => {
  dispatch({ type: POST_RESEARCH_ANALYST_REQUEST });
  try {
    const response = await axios.post(`${apiUrl}/permitions/dealer-status?dealer_id=${id}&dealer_status=${status}`,  {},{
      headers: { "Access-Token": token },
    });
    if(response.data.status=="success"){
      getDealers(token)
      getResearchAnalysts(token)
    }
    return response.data;
    // dispatch({ type: POST_RESEARCH_ANALYST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: POST_RESEARCH_ANALYST_FAILURE, payload: error.message });
  }
};




export const updateStatusResearchAnalyst = (id,status, token) => async (dispatch) => {
  dispatch({ type: POST_RESEARCH_ANALYST_REQUEST });
  try {
    const response = await axios.post(`${apiUrl}/permitions/manager-status?manager_id=${id}&manager_status=${status}`,  {},{
      headers: { "Access-Token": token },
    });
    if(response.data.status=="success"){
      getDealers(token)
      getResearchAnalysts(token)
    }
    return response.data;
    // dispatch({ type: POST_RESEARCH_ANALYST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: POST_RESEARCH_ANALYST_FAILURE, payload: error.message });
  }
};
// change Status of Dealer 

// POST dealer
// export const postDealer = (data, token) => async (dispatch) => {
//   dispatch({ type: POST_DEALER_REQUEST });
//   try {
//     const response = await axios.post(`${apiUrl}/dealers`, data, {
//       headers: { "Access-Token": token },
//     });
//     dispatch({ type: POST_DEALER_SUCCESS, payload: response.data });
//   } catch (error) {
//     dispatch({ type: POST_DEALER_FAILURE, payload: error.message });
//   }
// };
