import * as actionTypes from "../actions/actionTypes";
//import { updateObject, getDate } from '../../utility';


const init = {
  nights:{
    "20191028-20191029":{"length":"11.22","start":"2019-10-28T17:36:51"},
  },
  current:"20191028-20191029"
};



const reducer = (state = init, action) => {
  let newState = null;
  //console.log("action.type is:", action.type);
  //console.log(state);
  switch (action.type) {
    case actionTypes.FETCH_NIGHTS_STATE_SUCCESS:
      newState= {...state, ...action.state};
      return newState;
      //return updateObject(state, {nights:{...action.state.nights}});
    default:
      return state;
  }
};

export default reducer;
