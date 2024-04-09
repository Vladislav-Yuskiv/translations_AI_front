import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PublicRoute from "./navigation/PublicRoute";
import PrivateRoute from "./navigation/PrivateRoute";
import RegistrationPage from "./pages/RegistrationPage";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route
                path="/"
                element={
                    <PublicRoute restricted redirectTo="/home">
                        <Navigate to="/login" />
                    </PublicRoute>
                }
            />
            <Route
                path={"/login"}
                element={
                    <PublicRoute>
                        <LoginPage/>
                    </PublicRoute>
                }
            />
            <Route
                path={"/registration"}
                element={
                    <PublicRoute>
                        <RegistrationPage/>
                    </PublicRoute>
                }
            />
            <Route
                path={"/home"}
                element={
                    <PrivateRoute>
                        <HomePage/>
                    </PrivateRoute>
            }
            />
            <Route
                path="*"
                element={<Navigate to="/" />}
            />
        </Routes>
    </div>
  );
}

export default App;
