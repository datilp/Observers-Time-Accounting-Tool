import * as actionTypes from './actionTypes';
import * as actions from './index';
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

export function fetchStateError(error) {
    return {
        type: actionTypes.FETCH_STATE_ERROR,
        error: error
    }
}

export function fetchStateAction(dateRange) {
    return {
        type: actionTypes.FETCH_STATE,
        dateRange
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

function fetchState(dateRange) {
    //console.log("in fetchStateAction:" + dateRange);
    //dateRange="20191104-20191105";
    //dateRange="20200123-20200124";

    var url = dateRange==null?"/getstate.pl":"/getstate.pl?dateRange=" + dateRange;
    return dispatch => {
        dispatch(fetchStatePending());
        instance.get(url,
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
            // console.log("fetching:", res.data);
            dispatch(fetchStateSuccess(res.data));

            //calculating nights end.
            const nights = res.data.nights;
            //console.log("fetch:", nights);
            const nightLen = nights.nights[nights.current].length;
            const nightStart = nights.nights[nights.current].start;
            nights.nightEnd = nightEnd(nightStart, nightLen);
            //console.log("fetch:NightStart:", nightStart, "; nightLen:", nightLen, "; nightEnd:", nightEnd);
            //console.log("fetch:programs:", res.data);

            dispatch(actions.appStateUpdateAction(nights.nightEnd, nightStart));
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

export default fetchState;