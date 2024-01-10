import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Home from "./components/Home"; // Example component for authenticated user's home page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        {/* Example route for authenticated user's home page */}
        <Route path="/home" element={<Home />} />
        {/* Add more routes for different pages/components */}
        {/* Default route or 404 not found */}
        <Route path="/" element={<LoginForm />} /> {/* Render login form as default */}
      </Routes>
    </Router>
  );
}

export default App;
