import * as actionsTypes from '../actions/actionTypes';
import {getDate, hasNightEnded, hasNightStarted} from '../../utility';

const init = {
    isEndOfNight:false
};

const appState = (state=init, action) => {
    var newState = state;
    switch(action.type) {
        case actionsTypes.UPDATE_APP_STATE:
            const isEndOfNight = hasNightEnded(action.nightEnd);
            const isStartOfNight = hasNightStarted(action.nightStart);
           

            if (state.isStartOfNight !== isStartOfNight) {
                //console.log("night end has changed");

                newState = { ...state, isStartOfNight: isStartOfNight };
            }
            if (state.isEndOfNight !== isEndOfNight) {
                //console.log("night end has changed");

                newState = { ...newState, isEndOfNight: isEndOfNight };
            } 

            /*
           console.log("UPDATE_APP_START:",
            ";NE?:", isEndOfNight, 
            ";NE:", action.nightEnd,
            ";NS?:", isStartOfNight,
            ";NS:", action.nightStart,
            ";NS:", getDate(action.nightStart),
            ";NOW:", new Date(),
            ";", newState);
            */
            
            return newState;
        default:
            return state;
    }
}

export default appState;