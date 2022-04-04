import UserReducer from "./reducers/user";
import { combineReducers, createStore } from "redux";

const RootReducer = combineReducers({
  user: UserReducer,
});

const store = createStore(RootReducer);

export default store;
