import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.scss";
import "./index.css";
import "./fonts/line-awesome-1.3.0/css/line-awesome.css";
import "rc-slider/assets/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CartProvider } from "containers/CartContext";

ReactDOM.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
