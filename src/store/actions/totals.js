import * as actionTypes from './actionTypes';
import { nightLenTillNow } from '../../utility';

export const updateTotalsDispatch = (key, interval, ostime) => {
   return {
        type: actionTypes.UPDATE_TOTALS,
        key: key,
        interval,
        ostime //open shutter time
    };
}


export const dwnUpdateTotalsAction = (thisBin) => {
    return (dispatch, getState) => {
        const nights = getState().nights;
        const {downtime} = getState().downtime;

        const interval = downtime.bins[thisBin].interval[
            downtime.bins[thisBin].interval.length -1
        ];
        //var deltatime = (getDate(interval.stoptime) - getDate(interval.starttime));
        //console.log("[updateTotalsAction]", actionTypes.UPDATE_TOTALS, deltatime);
        dispatch(updateTotalsDispatch(thisBin, interval, nightLenTillNow(nights)));
    };
};

export const prgUpdateTotalsAction = (thisBin) => {
    return (dispatch, getState) => {
        const nights = getState().nights;

        const interval = getState().programs.programs.bins[thisBin].interval[
            getState().programs.programs.bins[thisBin].interval.length -1
        ];
        //var deltatime = (getDate(interval.stoptime) - getDate(interval.starttime));
        //console.log("[updateTotalsAction]", actionTypes.UPDATE_TOTALS, deltatime);
        dispatch(updateTotalsDispatch(thisBin, interval, nightLenTillNow(nights)));

        //dispatch(updateTotalsDispatch(thisBin, deltatime));
    };
};
