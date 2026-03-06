import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/Index.css";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

// Debug: cek root element
const rootElement = document.getElementById("root");
console.log("🔍 Root element:", rootElement);

if (!rootElement) {
  console.error("❌ Root element tidak ditemukan!");
} else {
  console.log("✅ Root element ditemukan, mencoba mount React...");
  
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <BrowserRouter>
          <CartProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </CartProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
    console.log("✅ React berhasil di-mount!");
  } catch (error) {
    console.error("❌ Error saat mount React:", error);
  }
}