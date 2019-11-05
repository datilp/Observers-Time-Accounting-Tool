import * as actionTypes from "../actions/actionTypes";
//import { updateObject, getDate } from '../../utility';

const init = {
  running_totals:{}
};

const calculateTotalDowntime = (state, nightsLen) => {
    var downTimeStates = [
        actionTypes.WEATHERLOSS, 
        actionTypes.POORWTHPROG, 
        actionTypes.TECHDOWNTIME];

        var totalDowntime = 0;
        downTimeStates.forEach(bin => {
            totalDowntime += state.running_totals[bin]==null?0.0:state.running_totals[bin];
        });

        state.running_totals[actionTypes.OPENSHUTTER] = nightsLen - totalDowntime;

//    if (downTimeSTates.includes(bin)) {
//    }
}

const reducer = (state = init, action) => {
  let newState = null;
  //console.log("action.type is:", action.type);
  //console.log(state);
  switch (action.type) {
    case actionTypes.UPDATE_TOTALS:
        newState = {...state, running_totals: {...state.running_totals}};
        if (newState.running_totals[action.key] == null) {
            newState.running_totals[action.key] = 0;
        }
        newState.running_totals[action.key] += action.deltatime/(1000*60*60);

        calculateTotalDowntime(newState, action.ostime);
        // console.log("UPDATE_TOTALS:", action.key, action.deltatime);

        //console.log("TOTALS:", action.ostime, action.deltatime, state, newState);
        return newState;
    case actionTypes.FETCH_TOTALS_STATE_SUCCESS:
        //console.log("[Totals]:", state, action.state);
        //newState= {...state, running_totals:{...state.running_totals}};
        newState= {...state, ...action.state};

        //console.log("[Totals]:", state, newState);

        return newState;
      //return {...state, running_totals:{...action.state}};
    default:
      return state;
  }
};

export default reducer;
