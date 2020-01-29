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

const addIntervalToBinAction = (state, action, bin_type) => {
  //console.log("[addIntervalToBinAction]", state, action, bin_type);
  let newState = {
    ...state,
    downtime: {
      ...state.downtime,
      bins: { ...state.downtime.bins }
    }
  };

  let newBin =
      newState.downtime.bins[bin_type] == null
        ? { [bin_type]: { interval: [], tonightTime: 0 } }
        : {
            [bin_type]: {
              ...newState.downtime.bins[bin_type],
              interval: newState.downtime.bins[bin_type].interval.slice()
            }
          };

    newState.downtime.bins = { ...newState.downtime.bins, ...newBin };

    newState.downtime.bins[bin_type].interval = action.intervals;
    /*if (Array.isArray(action.interval)) {
      action.interval.map(elem => {
        newState.downtime.bins[bin_type].interval.push(elem);
      })
    } else {
      newState.downtime.bins[bin_type].interval.push(action.interval);
    }*/
    /*action.interval.map(elem => {
      newState.downtime.bins[bin_type].interval.push(elem)
    });*/
    
    //newState.downtime.bins[bin_type].interval = [...action.interval];

    var tonightTime = 0.0;
    newState.downtime.bins[bin_type].interval.forEach(interval => {
      tonightTime +=
        getDate(interval.stoptime).getTime() -
        getDate(interval.starttime).getTime();
    });
    newState.downtime.bins[bin_type].tonightTime = tonightTime;
    //console.log("estoy aqui!!", newState);

    return newState;
};

const updateBinWithIntervalListAction = (state, action, bin_type) => {
  //console.log("[addIntervalToBinAction]", state, action, bin_type);
  let newState = {
    ...state,
    downtime: {
      ...state.downtime,
      bins: { ...state.downtime.bins }
    }
  };

  let newBin =
      newState.downtime.bins[bin_type] == null
        ? { [bin_type]: { interval: [], tonightTime: 0 } }
        : {
            [bin_type]: {
              ...newState.downtime.bins[bin_type],
              interval: newState.downtime.bins[bin_type].interval.slice()
            }
          };

    newState.downtime.bins = { ...newState.downtime.bins, ...newBin };

    /*newState.downtime.bins[bin_type].interval.push(
      action.interval
    );*/

    newState.downtime.bins[bin_type].interval = [...action.interval];

    var tonightTime = 0.0;
    newState.downtime.bins[bin_type].interval.forEach(interval => {
      tonightTime +=
        getDate(interval.stoptime).getTime() -
        getDate(interval.starttime).getTime();
    });
    newState.downtime.bins[bin_type].tonightTime = tonightTime;
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

  if (getDate(nightStart)< nowDate) {
  state.downtime.bins[actionTypes.OPENSHUTTER].tonightTime = 
          (nowDate - getDate(nightStart)) - todaysDwnTonightTime;
  } else {
    state.downtime.bins[actionTypes.OPENSHUTTER].tonightTime = 0.0;

  }
          
  /*console.log("OSTonightTime:", nightEnd, nowDate, 
      getDate(nightStart), todaysDwnTonightTime,
      state.downtime.bins[actionTypes.OPENSHUTTER].tonightTime);*/
  
}
const calculateTonightTime = (downtime) => {
  Object.keys(downtime.bins).forEach(
    (key) => {
      //console.log(downtime.bins[key]);
      downtime.bins[key].tonightTime = 0.0;
      if ("interval" in downtime.bins[key]) {
        downtime.bins[key].interval.forEach(
          (interval) => {
            downtime.bins[key].tonightTime += 
            getDate(interval.stoptime) - getDate(interval.starttime);
          }
        )
      }
    }
  );
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
      calculateTonightTime(newState.downtime);
      calculateOSTonightTime(newState, action.nightStart, action.nightEnd);
      //console.log("[FETCH_DWNTIME_STATE_SUCCESS]", newState, action.state.downtime);
      return newState;
    case actionTypes.DOWNTIME_UPDATE:
      return updateBinWithIntervalListAction(state, action, action.key);    
    case actionTypes.CALC_OS_TNTIME:
      newState = {...state, 
        downtime: {
          ...state.downtime,
          bins: { ...state.downtime.bins }
        }
      };
      calculateOSTonightTime(newState, action.nightStart, action.nightEnd);

      return newState;
    case actionTypes.UPDATE_POORWEATHER:
      //I get an interval payload comming from one of the poorweather programs 
      //in the action structure.
      // We simply add that interval to the POORWEATHER bin
      newState = addIntervalToBinAction(state, action, actionTypes.POORWTHPROG);
      calculateOSTonightTime(newState, action.nightStart, action.nightEnd);
      return newState;

      //return state;
    case actionTypes.UPDATE_BACKUP:
      //I get an interval payload comming from one of the backup programs 
      // in the action structure.
      // We simply add that interval to the BACKUP bin
      return addIntervalToBinAction(state, action, actionTypes.BACKUPPROG);
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
