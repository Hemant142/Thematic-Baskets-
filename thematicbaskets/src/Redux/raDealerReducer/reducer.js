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
  POST_DEALER_FAILURE,
  UPDATE_DEALER_STATUS_REQUEST,
  UPDATE_DEALER_STATUS_SUCCESS,
  UPDATE_DEALER_STATUS_FAILURE
} from "../actionTypes";

const initialState = {
  researchAnalyst: [],
  dealer: [],
  isLoading: false,
  isError: false,
  error: "",
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RESEARCH_ANALYSTS_REQUEST:
    case GET_DEALERS_REQUEST:
    case POST_RESEARCH_ANALYST_REQUEST:
    case POST_DEALER_REQUEST:
    case UPDATE_DEALER_STATUS_REQUEST:
      return { ...state, isLoading: true };

    case GET_RESEARCH_ANALYSTS_FAILURE:
    case GET_DEALERS_FAILURE:
    case POST_RESEARCH_ANALYST_FAILURE:
    case POST_DEALER_FAILURE:
    case UPDATE_DEALER_STATUS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload,
      };

    case GET_RESEARCH_ANALYSTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        researchAnalyst: action.payload,
        isError: false,
      };

    case GET_DEALERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        dealer: action.payload,
        isError: false,
      };

    case POST_RESEARCH_ANALYST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        researchAnalyst: [...state.researchAnalyst, action.payload],
        isError: false,
      };

    case POST_DEALER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        dealer: [...state.dealer, action.payload],
        isError: false,
      };

    case UPDATE_DEALER_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        dealer: state.dealer.map(dealer =>
          dealer._id === action.payload.id ? { ...dealer, isActive: action.payload.status } : dealer
        ),
        isError: false,
      };

    default:
      return state;
  }
};
