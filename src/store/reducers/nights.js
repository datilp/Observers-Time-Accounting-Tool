import * as actionTypes from "../actions/actionTypes";
//import { updateObject, getDate } from '../../utility';


const init = {
  nights:{
  },
  current:null
};



const reducer = (state = init, action) => {
  let newState = null;
  //console.log("action.type is:", action.type);
  //console.log(state);
  switch (action.type) {
    case actionTypes.FETCH_NIGHTS_STATE_SUCCESS:
      //console.log("nights reducer:", action.state);
      newState= {...state, ...action.state};
      return newState;
      //return updateObject(state, {nights:{...action.state.nights}});
    default:
      return state;
  }
};

export default reducer;
