import * as actionTypes from "../actions/actionTypes";
import { getDate } from "../../utility";

const init = {
  downtime: {
    currentInterval: null,
    currentAction: null,
    currentBin: null,
    bins: {}
  }
};
const getNewState = (state, action) => {
  if (action.type === state.downtime.currentAction) {
    return state;
  }

  let newState = {
    ...state,
    downtime: {
      ...state.downtime,
      bins: { ...state.downtime.bins }
    }
  };

  newState.downtime.currentInterval = {
    starttime: new Date(),
    stoptime: null
  };
  newState.downtime.currentAction = action.type;
  newState.downtime.currentBin = action.key;
  return newState;
};

const endIntervalState = (state, action) => {
 
  if (
    state.downtime.currentAction != null &&
    state.downtime.currentBin !== action.key
  ) {
    return state;
  }

  //console.log("endIntervalState:" + action.key +"=?"+ state.downtime.currentBin, 

  let newState = {
    ...state,
    downtime: {
      ...state.downtime,
      bins: { ...state.downtime.bins }
    }
  };

  if (newState.downtime.currentInterval != null) {
    newState.downtime.currentInterval = { ...state.downtime.currentInterval };
    newState.downtime.currentInterval.stoptime = new Date();

    let old_bin = action.key;

    let newBin =
      newState.downtime.bins[old_bin] == null
        ? { [old_bin]: { interval: [], tonightTime: 0 } }
        : {
            [old_bin]: {
              ...newState.downtime.bins[old_bin],
              interval: newState.downtime.bins[old_bin].interval.slice()
            }
          };

    newState.downtime.bins = { ...newState.downtime.bins, ...newBin };

    newState.downtime.bins[old_bin].interval.push(
      newState.downtime.currentInterval
    );

    var tonightTime = 0.0;
    newState.downtime.bins[old_bin].interval.forEach(interval => {
      tonightTime +=
        getDate(interval.stoptime).getTime() -
        getDate(interval.starttime).getTime();
    });
    newState.downtime.bins[old_bin].tonightTime = tonightTime;
  }
  newState.downtime.currentInterval = null;
  newState.downtime.currentAction = null;
  newState.downtime.currentBin = null;
  return newState;
};

const calculateOSTonightTime = (state, nightStart, nightEnd)  => {
  var todaysDwnTonightTime = 0;
  //tonightTime is in seconds
  Object.keys(state.downtime.bins).filter( 
                key => !(key === actionTypes.OPENSHUTTER || key === actionTypes.CALIBRATION)
                ).forEach( key => {
    todaysDwnTonightTime += state.downtime.bins[key]==null? 0.0: state.downtime.bins[key].tonightTime;
  });

  var newBin = null;
  if (state.downtime.bins[actionTypes.OPENSHUTTER] == null) {
    newBin = { [actionTypes.OPENSHUTTER]: {"tonightTime":0.0}};
  } else {
    newBin = { [actionTypes.OPENSHUTTER]: {
      ...state.downtime.bins[actionTypes.OPENSHUTTER],
      tonightTime: 0.0
    }}
  }
  state.downtime.bins = { ...state.downtime.bins, ...newBin};

  //calculate tonight OpenShutter time based on end of night
  //if current time is later than end of night then use end of night (nightEnd)
  const nowDate = nightEnd < new Date()? nightEnd: new Date();

  state.downtime.bins[actionTypes.OPENSHUTTER].tonightTime = 
          (nowDate - getDate(nightStart)) - todaysDwnTonightTime;
          
  //console.log("OSTonightTime:", nightEnd, nowDate, 
  //    getDate(nightStart), todaysDwnTonightTime,
  //    state.downtime.bins[actionTypes.OPENSHUTTER].tonightTime);
  
}

const reducer = (state = init, action) => {
  let newState = null;
  //console.log("action.type is:", action.type);
  //console.log(state);
  switch (action.type) {
    case actionTypes.BIN_START:
      newState = getNewState(state, action);
      //console.log("DOWNTIME:", state, newState);  
      return newState;
    case actionTypes.BIN_STOP:
      newState = endIntervalState(state, action);
      calculateOSTonightTime(newState, action.nightStart, action.nightEnd);
      //console.log("DOWNTIME STOP:",newState);
      return newState;
    case actionTypes.FETCH_DWNTIME_STATE_SUCCESS:
      //console.log("[FETCH_DWNTIME_STATE_SUCCESS]", state, action.state);
      newState = { ...state, downtime: { ...action.state.downtime } };
      calculateOSTonightTime(newState, action.nightStart, action.nightEnd);
      return newState;
    case actionTypes.CALC_OS_TNTIME:
      newState = {...state, 
        downtime: {
          ...state.downtime,
          bins: { ...state.downtime.bins }
        }
      };
      calculateOSTonightTime(newState, action.nightStart, action.nightEnd);

      return newState;
    case actionTypes.TEST_ACTION:
      console.log("Triggered ", actionTypes.TEST_ACTION);
      return state;
    case actionTypes.TEST_ACTION2:
      console.log("Triggered ", actionTypes.TEST_ACTION2);
      return state;

    default:
      return state;
  }
};

export default reducer;
