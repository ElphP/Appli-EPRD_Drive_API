
import './App.css';
import LoginPage from "./Components/LoginPage/LoginPage";

import SecurityRoute from "./Components/SecurityRoute";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import AdminPage from "./Components/Admin/AdminPage";
import UserPage from "./Components/UserPage/UserPage";


function App() {
  


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    };

  return (
      <Router>
          <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                  path="/admin"
                  element={
                      <SecurityRoute requiredRole="admin">
                          <AdminPage onLogout={handleLogout} />
                      </SecurityRoute>
                  }
              />

              <Route
                  path="/user/:userID"
                  element={
                      <SecurityRoute requiredRole="user">
                          <UserPage onLogout={handleLogout} />
                      </SecurityRoute>
                  }
              />
              <Route path="*" element={<LoginPage />} />
          </Routes>
      </Router>
  );
}

export default App;
