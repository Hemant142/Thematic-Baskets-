import { GET_CLIENTS_SUCCESS, CLIENTS_FAILURE, CLIENTS_REQUEST } from "../actionTypes";

    const initalState = {
    clients: [],
    isLoading: false,
    isError: false,
    error: "",
  };
  export const reducer = (state = initalState, action) => {
    switch (action.type) {
      case CLIENTS_REQUEST:
        return { ...state, isLoading: true };
      case CLIENTS_FAILURE:
        return {
          ...state,
          isLoading: false,
          isError: true,
          error: action.payload,
        };
      case GET_CLIENTS_SUCCESS:
        return {
          ...state,
          isLoading: false,
          clients: action.payload,
          isError: false,
        };
  
      default:
        return state;
    }
  };
  