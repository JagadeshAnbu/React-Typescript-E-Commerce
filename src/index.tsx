import React from "react";
import ReactDOM from "react-dom/client";
//
import "./styles/index.scss";
import "./index.css";
import "./fonts/line-awesome-1.3.0/css/line-awesome.css";
import "rc-slider/assets/index.css";

//
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { CartProvider } from "containers/CartContext";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(

  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);

reportWebVitals();
