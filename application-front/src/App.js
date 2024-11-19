
import './App.css';
import LoginPage from "./Components/LoginPage/LoginPage";

import SecurityRoute from "./Components/SecurityRoute";
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";
// import React, { useState, useEffect } from "react";
import AdminPage from "./Components/Admin/AdminPage";
import UserPage from "./Components/UserPage/UserPage";


function App() {
  


  return (
      <>
      <div className="bg"></div>
          <Router>
              <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                      path="/admin"
                      element={
                          <SecurityRoute requiredRole="admin">
                              <AdminPage  />
                          </SecurityRoute>
                      }
                  />
                  <Route
                      path="/user/:userID"
                      element={
                          <SecurityRoute requiredRole="user">
                              <UserPage  />
                          </SecurityRoute>
                      }
                  />
                  <Route path="*" element={<LoginPage />} />
              </Routes>
          </Router>
      </>
  );
}

export default App;
