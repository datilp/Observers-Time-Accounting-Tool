import * as actions from '../actions';

const init = {
    history: []
};

const history = (state=init, action) => {
    console.log("action.type is", action.type)
    switch(action.type){
        case actions.TOHISTORY:
            return { ...state,
                    history: [...state.history].concat(
                        {
                            id: new Date(), 
                            value: action.current
                        })
                    };
        case actions.RMFROMHISTORY:
            let newHistory = state.history.filter(elem => elem.id !== action.byval.id);

            return { ...state,
                     history: newHistory};

    }
    return state;
};

export default history;