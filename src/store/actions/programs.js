import * as actionTypes from './actionTypes';
import * as actionCreators from "../../store/actions/index";

export const binStartDispatch = (key) => {
    return {
        type: actionTypes.PROGRAM_START,
        key: key
    };
};

export const binStopDispatch = (key) => {
    return {
        type: actionTypes.PROGRAM_STOP,
        key: key
    };
};

export const prgBinStartAction = (thisBin) => {
    return (dispatch, getState) => {
        const {downtime} = getState().downtime;
        const {programs} = getState().programs;

        //console.log("prgBinStartAction:", getState());

        // check if there is a downtime bin running if so stop it.
        if (downtime.currentInterval != null) {
            //stop old bin in downtime
            dispatch(actionCreators.dwnBinStopAction(downtime.currentBin));
        }

        // if currentInterval is set and currentProgramID is different from
        // passed in programID (thisBin) then it means there is a programID
        // running somewhere stop it and start this bin
        if (programs.currentInterval != null &&
            programs.currentProgramID !== thisBin) {
            //stop old bin
            dispatch(prgBinStopAction(programs.currentProgramID));
            //start this bin
            dispatch(binStartDispatch(thisBin));
            //persists state
            dispatch(actionCreators.persistState());

        } else if (programs.currentProgramID == null) {
            //start this bin
            dispatch(binStartDispatch(thisBin));
            //persists state
            dispatch(actionCreators.persistState());

        }
    }
};

export const prgBinStopAction = (thisBin) => {
    return (dispatch, getState) => {
        const {programs} = getState().programs;
        const nights = getState().nights;
        
        // if currentAction is set and currentBin is this bin
        if (programs.currentInterval != null &&
            programs.currentProgramID === thisBin) {
                //stop old bin
                dispatch(binStopDispatch(programs.currentProgramID));
                //calculates Open Shutter Tonight Time
                dispatch(actionCreators.updateOSTNTimeAction(nights.nights[nights.current].start,
                                                            nights.nights[nights.current].length));
                //calculate totals on old bin
                dispatch(actionCreators.prgUpdateTotalsAction(programs.currentProgramID));
                //persists state
                dispatch(actionCreators.persistState());

        }
    }
};
