import * as actionTypes from './actionTypes';
import fileSaver from 'file-saver';

export const saveDispatch = () => {
    return {
        type: actionTypes.SAVE_STATE
    };
}
export const saveState = ( res ) => {
    return (dispatch, getState) => {
            var blob = new Blob([JSON.stringify(getState())], {type: "text/json;charset=utf-8"});
            fileSaver.saveAs(blob, "hello_world.txt");
            console.log("in saveState:", getState());
            dispatch(saveDispatch());
    }
};
