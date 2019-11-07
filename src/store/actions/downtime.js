import * as actionTypes from './actionTypes';
import * as actionCreators from "../../store/actions/index";

export const testAction = () => {
    return {
        type: actionTypes.TEST_ACTION
    };
};


export const binStartDispatch = (key) => {
    return {
        type: actionTypes.BIN_START,
        key: key
    };
};

export const binStopDispatch = (key, nightStart, nightEnd) => {
    return {
        type: actionTypes.BIN_STOP,
        key: key,
        nightStart,
        nightEnd
    };
};

export const updateOSTNTimeAction = (nightStart,nightEnd) => {
    return {
        type: actionTypes.CALC_OS_TNTIME,
        nightStart,
        nightEnd
    }
};

export const dwnBinStartAction = (thisBin) => {
    return (dispatch, getState) => {
        const {downtime} = getState().downtime;
        const {programs} = getState().programs;

        // check if there is program running if so stop it.
        if (programs.currentInterval != null) {
            //stop old bin in downtime
            dispatch(actionCreators.prgBinStopAction(programs.currentProgramID));
        }

        // if currentInterval is set and currentBin is different from
        // passed in bin (thisBin) then it means there is a bin running somewhere
        // stop it and start this bin
        //console.log("dwBinStartAction:", downtime);
        if (downtime.currentInterval != null &&
            downtime.currentBin !== thisBin) {
                //stop old bin
                dispatch(dwnBinStopAction(downtime.currentBin));
                //start this bin
                dispatch(binStartDispatch(thisBin));
                //persists state
                dispatch(actionCreators.persistState());
        } else if (downtime.currentBin == null) {
                //start this bin
                //console.log("start new bin2");
                dispatch(binStartDispatch(thisBin));
                //persists state
                dispatch(actionCreators.persistState());

        }
    }
};

export const dwnBinStopAction = (thisBin) => {
    return (dispatch, getState) => {
        const {downtime} = getState().downtime;
        const nights = getState().nights;

        // if currentInterval is set and currentBin is this bin
        if (downtime.currentInterval != null &&
            downtime.currentBin === thisBin) {
                //stop old bin
                dispatch(binStopDispatch(downtime.currentBin, 
                    nights.nights[nights.current].start,
                    nights.nightEnd));
                //calculate totals on old bin
                dispatch(actionCreators.dwnUpdateTotalsAction(downtime.currentBin));
                //persists state
                dispatch(actionCreators.persistState());

        }
    }
};