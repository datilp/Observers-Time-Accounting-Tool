import * as actionTypes from './actionTypes';
import * as actionCreators from "../../store/actions/index";

export const appStateUpdateAction = (nightEnd) => {
    return {
        type: actionTypes.UPDATE_APP_STATE,
        nightEnd
    };
}
export const appStateUpdateDispatch = ( ) => {
    return (dispatch, getState) => {
        const state0 = getState();
        const nights = state0.nights;

        //console.log("appStateUpdateDispatch:", state0.appState);
        dispatch(appStateUpdateAction(nights.nightEnd));
        const state1 = getState();
        //console.log("appStateUpdateDispatch2:", state1.appState);

        //if the end of night state has changed and
        //there are timers running, dispatch stop actions
        if (state0.appState.isEndOfNight !== state1.appState.isEndOfNight) {
            //console.log(state1.programs.programs);
            //check if there is something that needs to be stop
            // except calibrations
            if (state1.downtime.downtime.currentInterval != null &&
                state1.downtime.downtime.currentBin !== actionTypes.CALIBRATION) {
                //console.log("dispatching dwnBinStopAction", state1.downtime.downtime.currentBin);
                dispatch(actionCreators.dwnBinStopAction(state1.downtime.downtime.currentBin));
            }

            if (state1.programs.programs.currentInterval != null) {
                //console.log("dispatching prgBinStopAction", state1.programs.programs.currentProgramID);
                dispatch(actionCreators.prgBinStopAction(state1.programs.programs.currentProgramID));
            }
        }
    }
};
