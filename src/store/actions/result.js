import * as actionTypes from './actionTypes';
import fileSaver from 'file-saver';

export const saveResult = ( res ) => {
    // const updatedResult = res * 2;
    return {
        type: actionTypes.STORE_RESULT,
        result: res
    };
}

export const saveDispatch = () => {
    return {
        type: actionTypes.SAVE_STATE
    };
};

export const saveStateToFile = () => {
    return {
        type: actionTypes.SAVE_STATE_TO_FILE
    };
};

export const saveState = ( res ) => {
    return (dispatch, getState) => {
            var blob = new Blob([JSON.stringify(getState())], {type: "text/json;charset=utf-8"});
            fileSaver.saveAs(blob, "hello_world.txt");
            //console.log("in saveState:", getState());
            dispatch(saveDispatch());
    }
};

export const storeResult = ( res ) => {
    return (dispatch, getState) => {
        setTimeout( () => {
            // const oldCounter = getState().ctr.counter;
            //console.log("in storeResult:", getState());
            dispatch(saveResult(res));
        }, 2000 );
    }
};

export const deleteResult = ( resElId ) => {
    return {
        type: actionTypes.DELETE_RESULT,
        resultElId: resElId
    };
};

export const persistState = () => {
    return {
        type: actionTypes.PERSIST_STATE
    };
}
