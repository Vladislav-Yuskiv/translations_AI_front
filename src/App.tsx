import React, {useEffect} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PublicRoute from "./navigation/PublicRoute";
import PrivateRoute from "./navigation/PrivateRoute";
import RegistrationPage from "./pages/RegistrationPage";
import {useDispatch} from "react-redux";
import {currentUser} from "./redux/user/userSlice";
import TranslationsPage from "./pages/TranslationsPage";
import AccountPage from "./pages/AccountPage";
import SettingsPage from "./pages/SettingsPage";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
          dispatch(currentUser())
  }, [dispatch]);

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
                    <PublicRoute restricted redirectTo="/home">
                        <LoginPage/>
                    </PublicRoute>
                }
            />
            <Route
                path={"/registration"}
                element={
                    <PublicRoute restricted redirectTo="/home">
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
                path={"/translations"}
                element={
                    <PrivateRoute>
                       <TranslationsPage/>
                    </PrivateRoute>
                }
            />
            <Route
                path={"/account"}
                element={
                    <PrivateRoute>
                        <AccountPage/>
                    </PrivateRoute>
                }
            />
            <Route
                path={"/app-settings"}
                element={
                    <PrivateRoute>
                        <SettingsPage/>
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
