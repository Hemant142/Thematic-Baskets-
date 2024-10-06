import {
    GET_ALGO_REQUEST,
    GET_ALGO_SUCCESS,
    GET_ALGO_FAILURE,
    GET_SIGNAL_REQUEST,
    GET_SIGNAL_SUCCESS,
    GET_SIGNAL_FAILURE,
  } from "../actionTypes";
  
  const initialState = {

    algo: [],
    signals: [],
    isLoading: false,
    isError: false,
    error: "",
  };
  
  export const reducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_ALGO_REQUEST:
      case GET_SIGNAL_REQUEST:
        return { ...state, isLoading: true };

      case GET_ALGO_FAILURE:
      case GET_SIGNAL_FAILURE:
        return {
          ...state,
          isLoading: false,
          isError: true,
          error: action.payload,
        };
  
      case GET_ALGO_SUCCESS:
        return {
          ...state,
          isLoading: false,
          algo: action.payload,
          isError: false,
        };
  
      case GET_SIGNAL_SUCCESS:
        return {
          ...state,
          isLoading: false,
          signals: action.payload,
          isError: false,
        };
  
      default:
        return state;
    }
  };
  