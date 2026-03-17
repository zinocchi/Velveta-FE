import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/Index.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element tidak ditemukan!");
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <CartProvider>
          <AuthProvider>
            <App /> 
          </AuthProvider>
        </CartProvider>
      </React.StrictMode>
    );
    console.log("React berhasil di-mount!");
  } catch (error) {
    console.error(" Error saat mount React:", error);
  }
}