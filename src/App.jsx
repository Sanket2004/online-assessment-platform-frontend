import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import TestTake from "./components/TestAttempt";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import CreateTest from "./components/CreateTest";
import TestDetail from "./components/TestDetails";
import TestAttempt from "./components/TestAttempt";
import { UserProvider } from "./components/UserContext";
import InstructionsPage from "./components/InstructionsPage";
import MyAssessments from "./components/MyAssessments";
import { ToastProvider } from "./components/ui/toast"; // Adjust the path to where the toast component is located

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || ""); // Load token from local storage

  // This function updates the token and saves it to local storage
  const handleSetToken = (token) => {
    setToken(token);
    localStorage.setItem("token", token); // Save token to local storage
  };

  useEffect(() => {
    console.log("token: ", token);
  }, [token]); // Add token as dependency

  // Check if the user is authenticated
  const isAuthenticated = !!token; // Check if user is authenticated based on the presence of a token

  return (
    <ToastProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route
              path="/login"
              element={<Login setToken={handleSetToken} />}
            />
            <Route
              path="/test/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <TestTake token={token} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-test"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CreateTest />
                </ProtectedRoute>
              }
            />
            {/* <Route
            path="/tests/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <TestDetail />
              </ProtectedRoute>
            }
          /> */}
            <Route
              path="/tests/attempt/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <TestAttempt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-assessments"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <MyAssessments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructions"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <InstructionsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </UserProvider>
    </ToastProvider>
  );
};

export default App;
