import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/homepage" element={<Homepage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
