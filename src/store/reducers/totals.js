import * as actionTypes from "../actions/actionTypes";
import { getDate } from '../../utility';

const init = {
  running_totals: {}
};

const updateOpenShutterTotalTime = (state, nightLen) => {
  
  var downTimeStates = [
    actionTypes.WEATHERLOSS,
    actionTypes.POORWTHPROG,
    actionTypes.TECHDOWNTIME
  ];

  var totalDowntime = 0;
  downTimeStates.forEach(bin => {
    totalDowntime +=
      state.running_totals[bin] == null ? 0.0 : state.running_totals[bin];
  });

  //console.log(nightLen, totalDowntime);

  state.running_totals[actionTypes.OPENSHUTTER] = nightLen - totalDowntime;
};

const reducer = (state = init, action) => {
  let newState = null;
  //console.log("action.type is:", action.type);
  //console.log(state);
  switch (action.type) {
    case actionTypes.UPDATE_TOTALS:
      newState = { ...state, running_totals: { ...state.running_totals } };
      if (newState.running_totals[action.key] == null) {
        newState.running_totals[action.key] = 0;
      }

      var deltatime = (getDate(action.interval.stoptime) 
              - getDate(action.interval.starttime));

      newState.running_totals[action.key] +=
        deltatime / (1000 * 60 * 60);
      
      updateOpenShutterTotalTime(newState, action.ostime);
      //console.log("TOTALS:", action.ostime, action.deltatime, state, newState);
      return newState;
    case actionTypes.FETCH_TOTALS_STATE_SUCCESS:
      //console.log("[Totals]:", state, action.state);
      newState = { ...state, ...action.state };

      updateOpenShutterTotalTime(newState,
        action.nightLenTillNow);

      //console.log("[Totals]:", state, newState);

      return newState;
    default:
      return state;
  }
};

export default reducer;
