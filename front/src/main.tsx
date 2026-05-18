import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import App from "./App";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";

import MainLayout from "./layouts/MainLayout";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* rotas públicas */}
        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<App />}
        />

        {/* rotas com navbar/layout */}
        <Route element={<MainLayout />}>
          <Route
            path="/home"
            element={<Home />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);