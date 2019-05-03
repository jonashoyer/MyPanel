 import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import decode from "jwt-decode";
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import rootReducer from "./rootReducer";
import { BrowserRouter, Route } from "react-router-dom";
import { userLoggedIn } from './actions/auth';
import { fetchLists,changeListSelect} from './actions/list';
import {fetchActiveTime} from "./actions/time";
import setAuthorizationHeader from "./utils/setAuthHeader";
import {SetUserSetting} from "./actions/userSettings";


const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);
window.store = store;

const userSettings = ["todo_viewmode","theme"];

if(localStorage.jwt){
    const payload = decode(localStorage.jwt);
    const user = {
        token: localStorage.jwt,
        name: payload.name,
        betaInviter: payload.betaInviter
    };
    
    store.dispatch(userLoggedIn(user));
    setAuthorizationHeader(user.token);

    store.dispatch(fetchLists());

    store.dispatch(changeListSelect(localStorage.listSelected));

    userSettings.forEach( key => {
        const value = localStorage[key];
        if(value){
            store.dispatch(SetUserSetting(key,value));
        }
    })

    store.dispatch(fetchActiveTime());
}

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <Route component={App} />
        </Provider>
    </BrowserRouter>
, document.getElementById('root'));

registerServiceWorker();
