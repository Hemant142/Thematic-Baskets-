import {
  GET_SYMBOLS_SUCCESS,
  SYMBOLS_FAILURE,
  SYMBOLS_REQUEST,
  GET_UNDERLYING_INDEX_SUCCESS,
  UNDERLYING_INDEX_FAILURE,
  UNDERLYING_INDEX_REQUEST
} from "../actionTypes";

const initialState = {
  symbols: [],
  underlyingIndex: [],
  isLoading: false,
  isError: false,
  error: "",
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    // Symbols
    case SYMBOLS_REQUEST:
      return { ...state, isLoading: true };
    case SYMBOLS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload,
      };
    case GET_SYMBOLS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        symbols: action.payload,
        isError: false,
      };

    // Underlying Index
    case UNDERLYING_INDEX_REQUEST:
      return { ...state, isLoading: true };
    case UNDERLYING_INDEX_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload,
      };
    case GET_UNDERLYING_INDEX_SUCCESS:
      return {
        ...state,
        isLoading: false,
        underlyingIndex: action.payload,
        isError: false,
      };

    // Default case
    default:
      return state;
  }
};
