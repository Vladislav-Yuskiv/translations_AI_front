import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from "react-redux";
import {persistor, store} from "./redux/store";
import Loader from "./componets/Loader";
import {PersistGate} from "redux-persist/integration/react";
import {BrowserRouter} from "react-router-dom";
import './index.css';

import { defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/core/dist/BrightTheme.css';
defaultModules.set(PNotifyMobile, {});
const { defaults } = require('@pnotify/core');

defaults.width = '400px';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <PersistGate loading={<Loader />} persistor={persistor}>
              <BrowserRouter>
                  <App />
              </BrowserRouter>
          </PersistGate>
      </Provider>
  </React.StrictMode>
);

