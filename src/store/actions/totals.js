import * as actionTypes from './actionTypes';
import { nightLenTillNow } from '../../utility';

export const updateTotalsDispatch = (key, intervals, oldTonightTime, ostime) => {
   return {
        type: actionTypes.UPDATE_TOTALS,
        key: key,
        intervals,
        oldTonightTime,
        ostime //open shutter time
    };
}


export const dwnUpdateTotalsAction = (thisBin, oldTonightTime) => {
    return (dispatch, getState) => {
        const nights = getState().nights;
        const {downtime} = getState().downtime;

        /*const interval = downtime.bins[thisBin]!=null?downtime.bins[thisBin].interval[
            downtime.bins[thisBin].interval.length -1
        ]:[];*/
        const intervals = downtime.bins[thisBin]==null?[]:downtime.bins[thisBin].interval;

        //var deltatime = (getDate(interval.stoptime) - getDate(interval.starttime));
        //console.log("[updateTotalsAction]", actionTypes.UPDATE_TOTALS, deltatime);
        dispatch(updateTotalsDispatch(thisBin, intervals, oldTonightTime, nightLenTillNow(nights)));
    };
};

export const prgUpdateTotalsAction = (thisBin, oldTonightTime) => {
    return (dispatch, getState) => {
        const {programs} = getState().programs;
        const nights = getState().nights;

        /*//get the last interval
        const interval = getState().programs.programs.bins[thisBin].interval[
            getState().programs.programs.bins[thisBin].interval.length -1
        ];*/
        const intervals = programs.bins[thisBin]==null?[]:programs.bins[thisBin].interval;

        //const tonightTime = getState().programs.programs.bins[thisBin].tonightTime;
        //var deltatime = (getDate(interval.stoptime) - getDate(interval.starttime));
        //console.log("[updateTotalsAction]", thisBin, intervals, oldTonightTime,  nightLenTillNow(nights));
        dispatch(updateTotalsDispatch(thisBin, intervals, oldTonightTime, nightLenTillNow(nights)));

        //dispatch(updateTotalsDispatch(thisBin, deltatime));
    };
};
