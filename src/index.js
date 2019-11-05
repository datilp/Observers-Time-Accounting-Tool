import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import {Provider} from 'react-redux';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
//import axios from 'axios';
import instance from './axiosInstance';
import downtimeReducer from './store/reducers/downtime';
import nightsReducer from './store/reducers/nights';
import totalsReducer from './store/reducers/totals';

import progReducer from './store/reducers/programs';

import * as actionTypes from './store/actions/actionTypes';
import fileSaver from 'file-saver';


/*const instance = axios.create({
    baseURL: 'http://localhost/cgi-bin'
  });
*/
/*
axios.defaults.proxy = {
    host: 'localhost',
    port: 80
  };
axios.defaults.baseURL = 'http://localhost';
axios.defaults.headers = {
    'Access-Control-Allow-Origin': '*'
}
*/
/* 
,{
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        proxy: {
          host: 'localhost',
          port: 80
        }} 
*/
const rootReducer = combineReducers({
    downtime: downtimeReducer,
    nights: nightsReducer,
    totals: totalsReducer,
    programs: progReducer
    //hist: historyReducer,
});

/* const postJSON5 = (state) => {
    fetch('/cgi-bin/miniQ.py', {name:"igor", cat:"copi"});
}


const postJSON4 = (state) => {
    fetch('/cgi-bin/miniQ.py?name=igor');
}
const postJSON6 = (state) => {
    fetch('/cgi-bin/miniQ.py', {

    //fetch('/cgi-bin/dump.pl', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        dataType: "json",
        body: JSON.stringify({'param':{
         "name": "igor",
         "cat": "Copi"
        }})
    });
}



const postJSON1 = (state) => {
    const formData = new FormData();
    formData.append('name', "igor");
    formData.append('cat', 'Copi');
    const config = {
        headers:     {
            //'content-type':'multipart/form-data'
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    axios(
        {method:'post',
//        url: '/cgi-bin/miniQ.py',
        url: '/cgi-bin/dump2.pl',

        //axios.post('/cgi-bin/dump.pl',
        data: formData,
        config: {headers:     {
            //'content-type':'multipart/form-data'
            'Content-Type': 'application/x-www-form-urlencoded'
        }}})
    .then( response => { 
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}

const postJSON00 = (state) => {
    //axios.post('/cgi-bin/miniQ.py',
    axios.post('/cgi-bin/dump.pl',

    JSON.stringify({name: 'Alex', 
        surname: 'Moran', 
        email: 'alexmoran@bms.edu'}), 
        {headers: {'Accept': 'application/json'}})
    .then( response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}

const postJSON0 = (state) => {
    axios.post('/cgi-bin/miniQ.py', {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        withCredentials:true,
        baseURL: 'http://localhost',
        proxy: {
          host: 'localhost',
          port: 80
        }} , 
        JSON.stringify({name: 'Alex', 
        surname: 'Moran', 
        email: 'alexmoran@bms.edu'}), 
        {headers: {'Accept': 'application/json'}})
    .then( response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}*/

/* This is Good
const postJSON = (state) => {
    //console.log(JSON.stringify(state));
    fetch('/cgi-bin/dump.pl', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        dataType: "json",
        body: JSON.stringify(state)
    });
};
*/

const postJSON = (state) => {
    //console.log(JSON.stringify(state));
    //instance.post('/axios.pl',

    instance.post('/dump.pl',
        state
    );
};

const persister = store => {
    return next => {
        return action => {
            //console.log('[Middleware] persister ', action);
            //console.log('[Middleware] persister1 ', action, store.getState());

            const result = next(action);
            //console.log('[Middleware] persister2 ', action, store.getState());
            
            if ( actionTypes.PERSIST_STATE === action.type) {
                //next({type:actionTypes.TEST_ACTION2});
                //console.log('[Middleware] persister state after action ', store.getState());
                postJSON(store.getState());
            }
            if ( actionTypes.SAVE_STATE_TO_FILE === action.type) {
                //next({type:actionTypes.TEST_ACTION2});
                const state = store.getState();
                console.log('[Middleware] persister state after action ', state, state.nights.current + ".json");
                var blob = new Blob([JSON.stringify(state)], {type: "text/json;charset=utf-8"});
                fileSaver.saveAs(blob, state.nights.current + ".json");
            }
            return result;
            
        }
    }
};

const timeKeeper = store => {
    return next => {
        
        return action => {
            const state = store.getState();

            //console.log('[Middleware] timeKeeper ', action.type, state.downtime.downtime);
            if (actionTypes.PROGRAM_START === action.type
                && state.downtime.downtime.currentAction != null) {
                    let currentAction = state.downtime.downtime.currentAction;
                    let actionKey = currentAction.split('_')[0];

                    let newAction = actionKey + "_STOP";
                    //console.log('[Middleware] timeKeeper sending new action:',action, newAction);

                    next({type: newAction,
                    key:actionKey});
            } else if (
                [
                    actionTypes.BIN_START,
                    actionTypes.BIN_STOP,
                ].includes(action.type) 
                && state.programs.programs.currentProgramID != null
            ) {
                let programID = state.programs.programs.currentProgramID;
                //console.log('[Middleware] timeKeeper sending new action2:',action, actionTypes.PROGRAM_STOP);

                next({type: actionTypes.PROGRAM_STOP,
                key:programID});
            }
            return next(action);
            /*
            
//            console.log('[Middleware] persister ', action, store.getState());

            const result = next(action);
            if (
                [
                actionTypes.WEATHERLOSS_START,
                actionTypes.WEATHERLOSS_STOP,
                actionTypes.POORWTHPROG_START,
                actionTypes.POORWTHPROG_STOP,
                actionTypes.TECHDOWNTIME_START,
                actionTypes.TECHDOWNTIME_STOP,
                actionTypes.CALIBRATION_START,
                actionTypes.CALIBRATION_STOP
                ].includes(action.type)
            ) {
                console.log('[Middleware] persister state after action ', store.getState());
                postJSON(store.getState());
            }
            return result;
            */
        }
    }
};


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(rootReducer, composeEnhancers(applyMiddleware(persister, thunk)));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
