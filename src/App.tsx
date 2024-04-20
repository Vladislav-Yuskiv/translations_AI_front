import React, {useEffect} from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
  Routes,
  useBlocker,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PublicRoute from "./navigation/PublicRoute";
import PrivateRoute from "./navigation/PrivateRoute";
import RegistrationPage from "./pages/RegistrationPage";
import {useDispatch, useSelector} from "react-redux";
import {currentUser} from "./redux/user/userSlice";
import TranslationsPage from "./pages/TranslationsPage";
import AccountPage from "./pages/AccountPage";
import SettingsPage from "./pages/SettingsPage";
import userSelectors from "./redux/user/userSelectors";
import Loader from "./componets/Loader";


let router = createBrowserRouter(
    createRoutesFromElements(
        <>
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
        </>
    )
);

function App() {

  const dispatch = useDispatch();
  const refreshLoading = useSelector(userSelectors.getRefreshLoading)
  const loginLoading = useSelector(userSelectors.getLoginLoading)
  const showUnsaved = useSelector(userSelectors.getShowUnsaved)

  useEffect(() => {
          dispatch(currentUser())
  }, [dispatch]);

  const showLoader = refreshLoading || loginLoading

  useEffect(() => {
    const handleBeforeUnload = (event:any) => {
      if(showUnsaved){
        event.preventDefault();
        event.returnValue = '';
      }

    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showUnsaved]);

  return (
    <div className="App">
        {refreshLoading
            ? <Loader/>
            : (
                <RouterProvider router={router} />
            )
        }

    </div>
  );
}

export default App;
