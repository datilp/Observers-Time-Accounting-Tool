import * as actionTypes from './actionTypes';
import { getDate } from '../../utility';

export const updateTotalsDispatch = (key, deltatime, ostime) => {
   return {
        type: actionTypes.UPDATE_TOTALS,
        key: key,
        deltatime: deltatime,
        ostime: ostime //open shutter time
    };
}

const calculateNightsLenTillNow = (nights, downtime) => {
        //calculate length of nights so far
        var totalNightsLenTillYesterday = 0;
        
        Object.keys(nights.nights).forEach( key => {
            if (key < nights.current) {
                //console.log("dwnUpdateTotalsAction1:", key, nights.current, nights.nights[key]);
                totalNightsLenTillYesterday += parseFloat(nights.nights[key].length);
            }
        })

        var tonight = (new Date() - getDate(nights.nights[nights.current].start))/(1000*60*60);

        /*console.log("dwnUpdateTotalsAction:", 
                    totalNightsLenTillYesterday,
                    tonight,
                    totalNightsLenTillYesterday + tonight);*/
        return  totalNightsLenTillYesterday + tonight;
}

export const dwnUpdateTotalsAction = (thisBin) => {
    return (dispatch, getState) => {
        const nights = getState().nights;
        const {downtime} = getState().downtime;

        const interval = downtime.bins[thisBin].interval[
            downtime.bins[thisBin].interval.length -1
        ];
        var deltatime = (getDate(interval.stoptime) - getDate(interval.starttime));
        //console.log("[updateTotalsAction]", actionTypes.UPDATE_TOTALS, deltatime);
        dispatch(updateTotalsDispatch(thisBin, deltatime, calculateNightsLenTillNow(nights,downtime)));
    };
};

export const prgUpdateTotalsAction = (thisBin) => {
    return (dispatch, getState) => {
        const nights = getState().nights;
        const {downtime} = getState().downtime;

        const interval = getState().programs.programs.bins[thisBin].interval[
            getState().programs.programs.bins[thisBin].interval.length -1
        ];
        var deltatime = (getDate(interval.stoptime) - getDate(interval.starttime));
        //console.log("[updateTotalsAction]", actionTypes.UPDATE_TOTALS, deltatime);
        dispatch(updateTotalsDispatch(thisBin, deltatime, calculateNightsLenTillNow(nights,downtime)));

        //dispatch(updateTotalsDispatch(thisBin, deltatime));
    };
};
