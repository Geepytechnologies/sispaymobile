import { combineReducers } from "redux";
import userSlice from "../slices/userSlice";
import accountSlice from "../slices/accountSlice";
import authSlice from "../slices/authSlice";

const rootReducer = combineReducers({
  user: userSlice,
  account: accountSlice,
  auth: authSlice,
});

export default rootReducer;
