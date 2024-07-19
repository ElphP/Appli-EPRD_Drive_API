
// import './App.css';
import LoginPage from "./Components/LoginPage/LoginPage";
import AdminPage from "./Components/Admin/AdminPage";
import UserPage from "./Components/UserPage/UserPage";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";


function App() {
  


  return (
      <Router>
          <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="*" element={<LoginPage />} />
          </Routes>
      </Router>
  );
}

export default App;
