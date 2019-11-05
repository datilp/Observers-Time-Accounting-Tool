import * as actionTypes from '../actions/actionTypes';

// Action Creators

function startTimer(baseValue = 0, initValue = 0) {
    return {
      type: actionTypes.START_NTIMER,
      baseValue: baseValue,
      initValue: 0
    };
  }
  
  function stopTimer() {
    return {
      type: actionTypes.STOP_NTIMER,
      initValue: 0
    };
  }
  
  function resetTimer() {
    return {
      type: actionTypes.RESET_NTIMER,
      initValue: 0
    }
  }
  
  
  // Reducer / Store
  
  const initialState = {
    startedValue: undefined,
    stoppedValue: undefined,
    baseValue: undefined
  };
  
  function reducer(state = initialState, action) {
    switch (action.type) {
      case actionTypes.RESET_NTIMER:
        return {
          ...state,
          baseValue: 0,
          startedValue: state.startedValue ? action.initValue : undefined,
          stoppedValue: state.stoppedValue ? action.initValue : undefined
        };
      case actionTypes.START_NTIMER:
        return {
          ...state,
          baseValue: action.baseValue,
          startedValue: action.initValue,
          stoppedValue: undefined
        };
      case actionTypes.STOP_NTIMER:
        return {
          ...state,
          stoppedValue: action.initValue
        }
      default:
        return state;
    }
  }
  
  const store = createStore(reducer)