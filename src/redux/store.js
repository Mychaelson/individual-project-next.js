import UserReducer from "./reducers/user";
import { applyMiddleware, combineReducers, createStore } from "redux";
import PostReducers from "./reducers/posts";
import thunk from "redux-thunk";

const RootReducer = combineReducers({
  user: UserReducer,
  post: PostReducers,
});

const store = createStore(RootReducer, applyMiddleware(thunk));

export default store;
