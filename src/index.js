import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./js/store";
import App from "./js/components/App";
import { PersistGate } from 'redux-persist/lib/integration/react';
import "./index.css"
import "./css/test.css"






render(
    <Provider store={store.store}>
        <PersistGate loading={null} persistor={store.persistor}>
          <App/>
        </PersistGate>
    </Provider>,
    document.getElementById("root")
);