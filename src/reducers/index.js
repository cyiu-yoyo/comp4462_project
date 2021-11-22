import { combineReducers } from "redux";
import { changeTimeSpan } from "./time";

const reduxApp = combineReducers({
  changeTimeSpan,
});

export default reduxApp;
