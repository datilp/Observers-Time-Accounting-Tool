import * as actionTypes from './actionTypes';
import instance from '../../axiosInstance';
import {nightEnd, nightLenTillNow} from '../../utility';

function fetchStatePending() {
    //console.log("in fetchStatePending");
    return {
        type: actionTypes.FETCH_STATE_PENDING
    }
}

function fetchStateSuccess(state) {
    return {
        type: actionTypes.FETCH_STATE_SUCCESS,
        state: state
    }
}

function fetchDowntimeStateSuccess(downtime,nightStart, nightEnd) {
    return {
        type: actionTypes.FETCH_DWNTIME_STATE_SUCCESS,
        state: downtime,
        nightStart,
        nightEnd
    }
}

function fetchNightsStateSuccess(nights) {
    return {
        type: actionTypes.FETCH_NIGHTS_STATE_SUCCESS,
        state: nights
    }
}


function fetchTotalsStateSuccess(totals, nightLenTillNow) {
    return {
        type: actionTypes.FETCH_TOTALS_STATE_SUCCESS,
        state: totals,
        nightLenTillNow
    }
}



function fetchProgramsStateSuccess(programs) {
    return {
        type: actionTypes.FETCH_PROGRAMS_STATE_SUCCESS,
        state: programs
    }
}

function fetchAppStateSuccess(nightEnd) {
    return {
        type: actionTypes.UPDATE_APP_STATE,
        nightEnd
    }
}


/*function fetchResStateSuccess(res) {
    return {
        type: actionTypes.FETCH_RES_STATE_SUCCESS,
        state: res
    }
}*/


function fetchStateError(error) {
    return {
        type: actionTypes.FETCH_STATE_ERROR,
        error: error
    }
}

/*function fetchStateActionBackup() {
    //console.log("in fetchStateAction");
    return dispatch => {
        dispatch(fetchStatePending());
        fetch('/cgi-bin/getstate.pl')
        .then(res => {
            //console.log("in fetch got json:", res.json());
            return res.json();})
        .then(res => {
            if(res.error) {
                console.log("Error fetching json:", res);
                throw(res.error);
            }
            //console.log("fetching1:", res);

            dispatch(fetchStateSuccess(res));
            //console.log("fetching:", res);
            dispatch(fetchNightsStateSuccess(res.nights));            
            dispatch(fetchTotalsStateSuccess(res.totals));           
            dispatch(fetchDowntimeStateSuccess(res.downtime));
            dispatch(fetchProgramsStateSuccess(res.programs));

            //dispatch(fetchResStateSuccess(res.res));

           
            return res;
        })
        .catch(error => {
            dispatch(fetchStateError(error));
        })
    }
}*/

function fetchStateAction() {
    //console.log("in fetchStateAction");
    return dispatch => {
        dispatch(fetchStatePending());
        instance.get('/getstate.pl',
        {
            transformResponse: [(response) => (JSON.parse(response))]
        }
        )
        /*.then(res => {
            console.log("in fetch got json:", res);
            return res.json();})*/
        .then(res => {
            if (res==null) {
                return null;
            } 

            if(res.error) {
                console.log("Error fetching json:", res);
                throw(res.error);
            }
           //console.log("fetching1:", res);

            dispatch(fetchStateSuccess(res.data));
            //console.log("fetching:", res.data);

            //calculating nights end.
            const nights = res.data.nights;
            //console.log("fetch:", nights);
            const nightLen = nights.nights[nights.current].length;
            const nightStart = nights.nights[nights.current].start;
            nights.nightEnd = nightEnd(nightStart, nightLen);
            dispatch(fetchAppStateSuccess(nights.nightEnd));
            dispatch(fetchProgramsStateSuccess(res.data.programs));
            dispatch(fetchDowntimeStateSuccess(res.data.downtime, 
                nights.nights[nights.current].start, 
                nights.nightEnd));
            dispatch(fetchNightsStateSuccess(res.data.nights));            
            dispatch(fetchTotalsStateSuccess(res.data.totals,
                nightLenTillNow(nights)));           

            //dispatch(fetchResStateSuccess(res.res));

           
            return res;
        })
        .catch(error => {
            console.log("get state:", error);
            dispatch(fetchStateError(error));
        })
    }
}

export default fetchStateAction;