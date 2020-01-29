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

//gets you a new state with the basic stuff initialized
// programs.bins[progId].{ interval:[], tonightTime:0, totaltime:0, progClass:class}
const getNewState = (state, progID) => {
  let newState = {
    ...state,
    programs: {
      ...state.programs,
      bins: { ...state.programs.bins }
    }
  };

  //Check if program exists in bin, if not create it.
  if(newState.programs.bins[progID] == null) {
    let progClass = state.programs.list.filter(prog=>prog.id===progID)[0].class;
    newState.programs.bins[progID] = { interval: [], tonightTime: 0, totaltime: 0 , progClass:progClass};
  } else {
    newState.programs.bins[progID] =  { ...state.programs.bins[progID] };
  }
  return newState;
}
const initNewState = (state, action) => {
  // if this program id is already started
  /*console.log(
    "action.type=" + action.type + "?",
    state.programs.currentProgramID + "?=" + action.key
  );*/
  let progID = action.key;

  if (
    state.programs.currentProgramID != null &&
    state.programs.currentProgramID === progID
  ) {
    return state;
  }

  let newState = getNewState(state, progID);

  newState.programs.currentInterval = {
    starttime: new Date(),
    stoptime: null
  };

  newState.programs.currentProgramID = progID;
  console.log("[PROGRAM REDUCER]", progID, action, newState);
  return newState;
};

const endIntervalState = (state, action) => {
  /*console.log(
    "action.type=" + action.type + "?",
    state.programs.currentProgramID + "?=" + action.key
  );*/
  //stop only current program ID
  let progID = action.key;

  if (
    state.programs.currentProgramID != null &&
    state.programs.currentProgramID !== progID
  ) {
    return state;
  }

  let newState = getNewState(state, progID);
  
  if (newState.programs.currentInterval != null) {
    newState = getNewState(state, progID);

    newState.programs.currentInterval = { ...state.programs.currentInterval };

    newState.programs.currentInterval.stoptime = new Date();

    let newBin =  {
                    [progID]: {
                      ...newState.programs.bins[progID],
                      interval: newState.programs.bins[progID].interval.slice()
                    }
                  };

    newState.programs.bins = { ...newState.programs.bins, ...newBin };

    newState.programs.bins[progID].interval.push(
        newState.programs.currentInterval);
    
    var tonightTime = calculateTonightTime(newState.programs.bins[progID]);
    newState.programs.bins[progID].tonightTime = tonightTime;
  }
  newState.programs.currentInterval = null;
  newState.programs.currentProgramID = null;
  //console.log("my state:", newState);
  return newState;
};

const updateIntervalState = (state, action) => {
  /*
    action carryies two pay loads
    action.key containing the bin id
    action.interval containing an array of starttime/stoptime pairs for each interval
  */
  /*console.log(
    "action.type=" + action.type + "?",
    state.programs.currentProgramID + "?=" + action.key
  );*/
  //stop only current program ID
  let progID = action.key;

  let newState = getNewState(state, progID);
  
  // action.interval is an array containing all the intervals for this program
  // hence it is ok to set the interval and not add.
  newState.programs.bins[progID].interval = action.interval.slice();

  //calculate tonightTime
  var tonightTime = calculateTonightTime(newState.programs.bins[progID]);
  newState.programs.bins[progID].tonightTime = tonightTime;

  //console.log("my state:", newState);
  return newState;
};

//calculate tonightTime for this bin
const calculateTonightTime = (bin) => {
  var tonightTime = 0.0;

  bin.interval.forEach(interval => {
    //console.log("stoptime:", interval.stoptime, "starttime:", interval.starttime, "dates:", getDate(interval.stoptime).getTime(), getDate(interval.starttime).getTime())
    tonightTime +=
      getDate(interval.stoptime).getTime() -
      getDate(interval.starttime).getTime();
  });
  return tonightTime;
}
// recalculates the tonightTime for all the bins
const recalculateAllBinsTonightTime = (programs) => {
  Object.keys(programs.bins).forEach(
    (progID) => {
      programs.bins[progID].tonightTime = calculateTonightTime(programs.bins[progID]);
    }
  );
}

const reducer = (state = init, action) => {
  let newState = null;
  //console.log("action.type is:", action.type);
  //console.log(state);
  switch (action.type) {
    case actionTypes.PROGRAM_START:
      return initNewState(state, action);
    case actionTypes.PROGRAM_STOP:
      return endIntervalState(state, action);
    case actionTypes.PROGRAM_UPDATE:
      return updateIntervalState(state, action);    
    case actionTypes.FETCH_PROGRAMS_STATE_SUCCESS:
      //console.log("[FETCH_DWNTIME_STATE_SUCCESS]", action.state.programs);
      newState = { ...state, programs: { ...action.state.programs } };
      recalculateAllBinsTonightTime(newState.programs);
      //console.log("[FETCH_DWNTIME_STATE_SUCCESS]2", newState.programs);

      return newState;
    default:
      return state;
  }
};

export default reducer;
