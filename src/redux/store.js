import UserReducer from "./reducers/user";
import { combineReducers } from "redux";

const RootReducer = combineReducers({
  user: UserReducer,
});

export default RootReducer;
