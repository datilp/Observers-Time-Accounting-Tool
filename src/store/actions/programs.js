import * as actionTypes from './actionTypes';
import * as actionCreators from "../../store/actions/index";

export const binStartDispatch = (key) => {
    return {
        type: actionTypes.PROGRAM_START,
        key: key
    };
};

export const binStopDispatch = (key) => {
    return {
        type: actionTypes.PROGRAM_STOP,
        key: key
    };
};

export const binUpdateDispatch = (key, interval) => {
    return {
        type: actionTypes.PROGRAM_UPDATE,
        key: key,
        interval: interval
    };
};

export const prgBinStartAction = (thisBin) => {
    return (dispatch, getState) => {
        const {downtime} = getState().downtime;
        const {programs} = getState().programs;
        const nights = getState().nights;

        //let progProps = programs.list.filter(prog=>prog.id === thisBin)[0];

        //console.log("prgBinStartAction:", getState());

        // check if there is a downtime bin running and if so stop it.
        if (downtime.currentInterval != null) {
            //stop old bin in downtime
            dispatch(actionCreators.dwnBinStopAction(downtime.currentBin));
        }

        // if currentInterval is set and currentProgramID is different from
        // passed in programID (thisBin) then it means there is a programID
        // running somewhere, stop it and start this bin
        if (programs.currentInterval != null &&
            programs.currentProgramID !== thisBin) {
            //stop old bin
            dispatch(prgBinStopAction(programs.currentProgramID));
            //start this bin
            dispatch(binStartDispatch(thisBin));
            //persists state
            dispatch(actionCreators.persistState());

        } else if (programs.currentProgramID == null) {
            //start this bin
            dispatch(binStartDispatch(thisBin));
            dispatch(actionCreators.updateOSTNTimeAction(nights.nights[nights.current].start,
                nights.nightEnd));

            //persists state
            dispatch(actionCreators.persistState());

        }
    }
};

const getIntervalForClass = (programs, progClass) => {
    let intervals=[];
    Object.keys(programs.bins).map(key => {
        if (programs.bins[key].progClass === progClass) {
            programs.bins[key].interval.map(interval => {
                intervals.push(interval);
                return null;
            })
        }
        return null;
    });
    return intervals;
};

export const prgBinStopAction = (thisBin) => {
    return (dispatch, getState) => {
        const programsb4update = getState().programs.programs;
        const nights = getState().nights;
        //console.log("[prgBinStopAction][b4 binStopDispatch]", programsb4update);
        // if currentAction is set and currentBin is this bin
        if (programsb4update.currentInterval != null &&
            programsb4update.currentProgramID === thisBin) {
                const oldTonightTime = programsb4update.bins[thisBin]==null?
                                        0.0:
                                        programsb4update.bins[thisBin].tonightTime;
                //stop old bin
                dispatch(binStopDispatch(programsb4update.currentProgramID));

                const {programs} = getState().programs;

                // Get this program properties first.
                let progProps = programs.list.filter(prog=>{return prog.id === thisBin})[0];
            
                if( progProps.class === actionTypes.POORWEATHER_TYPE) {
                    //we pass all the intervals for all programs that make the poorweather universe
                    let intervals = getIntervalForClass(programs, progProps.class);
                    //calculate totals on old bin
                    //console.log("[prgBinStopAction] intervals", intervals);
                    dispatch(actionCreators.updatePoorWeatherAction(intervals,
                        nights.nights[nights.current].start,
                        nights.nightEnd));
                    let poorweatherOldTonightTime = 0.0;
                    Object.keys(programsb4update.bins).map(id => {
                        if (programsb4update.bins[id].progClass === actionTypes.POORWEATHER_TYPE) {
                            poorweatherOldTonightTime += programsb4update.bins[id].tonightTime;
                        }
                        return null;
                    })
                    dispatch(actionCreators.dwnUpdateTotalsAction(actionTypes.POORWTHPROG,
                         poorweatherOldTonightTime));
                } else if (progProps.class === actionTypes.BACKUP_TYPE) {
                    let intervals = getIntervalForClass(programs, progProps.class);
                    dispatch(actionCreators.updateBackupAction(intervals, 
                        nights.nights[nights.current].start,
                        nights.nightEnd));
                    //calculate totals on old bin
                    let backupOldTonightTime = 0.0;
                    Object.keys(programsb4update.bins).map(id => {
                        if (programsb4update.bins[id].progClass === actionTypes.BACKUPPROG) {
                            backupOldTonightTime += programsb4update.bins[id].tonightTime;
                        }
                        return null;
                    });
                    dispatch(actionCreators.dwnUpdateTotalsAction(actionTypes.BACKUPPROG, backupOldTonightTime));
                   
                } else { //actionTypes.PROGRAM_TYPE
                    //calculates Open Shutter Tonight Time
                    dispatch(actionCreators.updateOSTNTimeAction(nights.nights[nights.current].start,
                        nights.nightEnd));
                    
                }
                //console.log("[prgBinStopAction]:prgUpdateTotalsAction:", thisBin);
                //calculate totals on old bin
                dispatch(actionCreators.prgUpdateTotalsAction(thisBin, oldTonightTime));
                //persists state
                dispatch(actionCreators.persistState());

        }
    }
};

export const prgBinUpdateAction = (thisBin, intervals) => {
    return (dispatch, getState) => {
        const programsb4update = getState().programs.programs;
        const {programs} = getState().programs;
        const nights = getState().nights;
        
        // if currentAction is set and currentBin is this bin
        //console.log("[prgBinUpdateAction]:", intervals);
        //stop old bin
        dispatch(binUpdateDispatch(thisBin, intervals));
        //console.log("[prgBinUpdateAction]:binUpdateDispatch");

        let progProps = programs.list.filter(prog=>prog.id === thisBin)[0];
        if( progProps.class === actionTypes.POORWEATHER_TYPE) {
            dispatch(actionCreators.updatePoorWeatherAction(intervals));
            let poorweatherOldTonightTime = 0.0;
            Object.keys(programsb4update.bins).map(id => {
                if (programsb4update.bins[id].progClass === actionTypes.POORWEATHER_TYPE) {
                    poorweatherOldTonightTime += programsb4update.bins[id].tonightTime;
                }
                return null;
            });
            dispatch(actionCreators.dwnUpdateTotalsAction(actionTypes.POORWTHPROG,
                    poorweatherOldTonightTime));
        } else if (progProps.class === actionTypes.BACKUP_TYPE) {
            dispatch(actionCreators.updateBackupAction(intervals));
            //TODO check if BACKUP_TYPE add to totals
            let backupOldTonightTime = 0.0;
            Object.keys(programsb4update.bins).map(id => {
                if (programsb4update.bins[id].progClass === actionTypes.BACKUP_TYPE) {
                    backupOldTonightTime += programsb4update.bins[id].tonightTime;
                }
                return null;
            });
            dispatch(actionCreators.dwnUpdateTotalsAction(actionTypes.BACKUPPROG, backupOldTonightTime));
        } else { //actionTypes.PROGRAM_TYPE
            //calculates Open Shutter Tonight Time
            dispatch(actionCreators.updateOSTNTimeAction(nights.nights[nights.current].start,
                nights.nightEnd));
            //console.log("[prgBinUpdateAction]:updateOSTNTimeAction");
       }
        
        //calculates Open Shutter Tonight Time
        //dispatch(actionCreators.updateOSTNTimeAction(nights.nights[nights.current].start,
        //                                            nights.nightEnd));
        //calculate totals on old bin
        //console.log("[prgBinUpdateAction]:prgUpdateTotalsAction:", thisBin);
        dispatch(actionCreators.prgUpdateTotalsAction(thisBin, 
            programs.bins[thisBin]==null?0.0:programs.bins[thisBin].tonightTime));
      
        //persists state
        dispatch(actionCreators.persistState());  
    }
};
