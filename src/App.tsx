import React, {useEffect} from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate, redirect,
    Route,
    redirectDocument,
    RouterProvider,
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
import CreateBundleModal from "./componets/Modals/CreateBundleModal";
import {bundlesSelectors} from "./redux/bundles";
import {createBundle, getBundles, setModalCreate} from "./redux/bundles/bundleSlice";
import {getBundleInfo} from "./redux/bundleKeys/bundleKeysSlice";
import {bundleKeysSelectors} from "./redux/bundleKeys";


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
  const showUnsaved = useSelector(userSelectors.getShowUnsaved)
  const isModalCreate = useSelector(bundlesSelectors.getModalCreate)  ;
  const bundlesLoading = useSelector(bundlesSelectors.getLoading);
  const currentBundle = useSelector(bundlesSelectors.getCurrentBundle);
  const keysInfo = useSelector(bundleKeysSelectors.getKeysInfo);
  const userId = useSelector(userSelectors.getUserId);

  useEffect(() => {
          dispatch(currentUser())
  }, [dispatch]);

    useEffect(() => {
        if(bundlesLoading || !userId) return

        dispatch(getBundles())
    }, [userId]);

    useEffect(() => {
        if(!currentBundle) return

        if(!keysInfo[currentBundle._id]){
            dispatch(getBundleInfo(currentBundle._id))
        }
    }, [currentBundle,keysInfo]);


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

        <CreateBundleModal
            isOpen={isModalCreate}
            onClose={() => dispatch(setModalCreate(false))}
            onSubmit={async (payload) =>  dispatch(createBundle(payload, () =>  redirectDocument("/home")))}
        />
    </div>
  );
}

export default App;
