import { applyMiddleware, combineReducers, legacy_createStore } from "redux"
import {thunk} from "redux-thunk"
import { reducer as authReducer } from "./authReducer/reducer"
import  {reducer as basketReducer} from "./basketReducer/reducer"
import { reducer as symbolsReducer } from "./symbolReducer/reducer"
import { reducer as clientsReducer } from "./clientReducer/reducer"
import { reducer as raDealerReducer } from "./raDealerReducer/reducer"
import { reducer as algoandSignalReducer } from "./algoandSignalsReducer/reducer"

const rootReducer = combineReducers({
    authReducer,basketReducer,symbolsReducer,clientsReducer,raDealerReducer,algoandSignalReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))