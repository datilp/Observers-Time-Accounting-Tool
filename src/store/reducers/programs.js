import * as actionTypes from "../actions/actionTypes";
import { getDate } from "../../utility";

const init = {
  programs: {
    currentInterval: null,
    currentProgramID: null,
    bins: {},
    list: []
  }
};

const getNewState = (state, action) => {
  // if this program id is already started
  /*console.log(
    "action.type=" + action.type + "?",
    state.programs.currentProgramID + "?=" + action.key
  );*/

  if (
    state.programs.currentProgramID != null &&
    state.programs.currentProgramID === action.key
  ) {
    return state;
  }

  let newState = {
    ...state,
    programs: {
      ...state.programs,
      bins: { ...state.programs.bins }
    }
  };

  newState.programs.currentInterval = {
    starttime: new Date(),
    stoptime: null
  };

  newState.programs.currentProgramID = action.key;
  //console.log("[PROGRAM REDUCER]", action, newState);
  return newState;
};

const endIntervalState = (state, action) => {
  /*console.log(
    "action.type=" + action.type + "?",
    state.programs.currentProgramID + "?=" + action.key
  );*/
  //stop only current program ID
  if (
    state.programs.currentProgramID != null &&
    state.programs.currentProgramID !== action.key
  ) {
    return state;
  }

  let newState = {
    ...state,
    programs: {
      ...state.programs,
      bins: { ...state.programs.bins }
    }
  };

  if (newState.programs.currentInterval != null) {
    newState.programs.currentInterval = { ...state.programs.currentInterval };

    newState.programs.currentInterval.stoptime = new Date();
    let old_bin = action.key;

    let newBin =
      newState.programs.bins[old_bin] == null
        ? { [old_bin]: { interval: [], tonightTime: 0, totaltime: 0 } }
        : {
            [old_bin]: {
              ...newState.programs.bins[old_bin],
              interval: newState.programs.bins[old_bin].interval.slice()
            }
          };

    newState.programs.bins = { ...newState.programs.bins, ...newBin };

    newState.programs.bins[old_bin].interval.push(
        newState.programs.currentInterval);

    var tonightTime = 0.0;
    newState.programs.bins[action.key].interval.forEach(interval => {
      tonightTime +=
        getDate(interval.stoptime).getTime() -
        getDate(interval.starttime).getTime();
    });
    newState.programs.bins[action.key].tonightTime = tonightTime;
    //TODO total time
  }
  newState.programs.currentInterval = null;
  newState.programs.currentProgramID = null;
  //console.log("my state:", newState);
  return newState;
};

const reducer = (state = init, action) => {
  let newState = null;
  //console.log("action.type is:", action.type);
  //console.log(state);
  switch (action.type) {
    case actionTypes.PROGRAM_START:
      return getNewState(state, action);
    case actionTypes.PROGRAM_STOP:
      return endIntervalState(state, action);
    case actionTypes.FETCH_PROGRAMS_STATE_SUCCESS:
      //console.log("[FETCH_DWNTIME_STATE_SUCCESS]", action.state.downtime.currentAction);
      newState = { ...state, programs: { ...action.state.programs } };
      return newState;
    default:
      return state;
  }
};

export default reducer;
