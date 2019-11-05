import * as actions from '../actions';

const init = {
    counter:35
};

const counter = (state=init, action) => {
    console.log("action.type is", action.type)
    switch(action.type){
        case actions.ADD:
            if ('byvalue' in action) {
                return { ...state, counter:state.counter + action.byvalue};
            } else {
                console.log("adding 1");
                return { ...state, counter:state.counter + 1};
            }
    }
    /*
    if (action.type === 'INCREMENT') {
        console.log("increment");
        return { ...state, counter: state.counter + 1};
    }
    */
    return state;
};

export default counter;