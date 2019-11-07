import * as actionsTypes from '../actions/actionTypes';
import {isNightEnded} from '../../utility';

const init = {
    isEndOfNight:false
};

const appState = (state=init, action) => {
    switch(action.type) {
        case actionsTypes.UPDATE_APP_STATE:
            const isEndOfNight = isNightEnded(action.nightEnd);
            if (state.isEndOfNight !== isEndOfNight) {
                //console.log("night end has changed");

                return { ...state, isEndOfNight: isEndOfNight };
            } else {
                //console.log("night end stays the same");
                return state;
            }
        default:
            return state;
    }
}

export default appState;