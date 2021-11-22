import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import DashBoard from "./components/DashBoard";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reduxApp from "./reducers";

let store = createStore(reduxApp);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <DashBoard />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
