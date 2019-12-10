import moment from 'moment';
import * as actionTypes from './store/actions/actionTypes';

export const updateObject = (oldObject, updatedValues) => {
    return {
        ...oldObject,
        ...updatedValues
    }
};

export const getDate = (date) => {
    //console.log("Date:", date);
    if (date instanceof Date) {
      //console.log("Date:[String]", date);

      return date;
    } else {
      //2019-10-28T17:30:13.368Z
      //const newDate = Date.parseDate(date, "YYYY-MM-DDTHH:MM:SS.sssZ");
      //const newDate = Date.parse(date);
      //const newDate = new Date();
      const newDate = new Date(date);

      //console.log("Date:[Date]", newDate.getTime());
      return newDate;
    }
  };


export const hasNightEnded2 = (nightStart, nightLen) => {
  const nightEnd = moment(nightStart).add(nightLen, 'hours').toDate();
  return nightEnd < new Date();
};

export const hasNightEnded3 = (nights) => {
  if (nights == null) {
    return false;
  }
  const nightStart = nights.nights[nights.current].start;
  const nightLen = nights.nights[nights.current].length;

  const nightEnd = moment(nightStart).add(nightLen, 'hours').toDate();
  return nightEnd < new Date();
};

export const test = () => {
  console.log("Test has been fired");
}
export const hasNightEnded = (nightEnd) => {
  return getDate(nightEnd) < new Date();
};

export const hasNightStarted = (nightStart) => {
  return getDate(nightStart) < new Date();
};

export const nightEnd = (nightStart, nightLen)  => {
    return moment(nightStart).add(nightLen, 'hours').toDate();
};

export const nightLenTillNow = (nights) => {
  //calculate length of nights so far
  var totalNightsLenTillYesterday = 0;
  
  Object.keys(nights.nights).forEach( key => {
      if (key < nights.current) {
          //console.log("dwnUpdateTotalsAction1:", key, nights.current, nights.nights[key]);
          totalNightsLenTillYesterday += parseFloat(nights.nights[key].length);
      }
  })

  // Today's night finishes by the end of the night.
  const nightStart = nights.nights[nights.current].start;
  const nightLen = nights.nights[nights.current].length;
  const nightEnd = moment(nightStart)
  .add(nightLen, "hours")
  .toDate();

  //if the night is done set the current night time to end of night
  const nightCurrentTime = (nightEnd < new Date())? nightEnd: new Date();

  //calculate tonight time based on nightEnd if reached.
  var tonight = (nightCurrentTime - getDate(nightStart))/(1000*60*60);

  /*console.log("dwnUpdateTotalsAction:", 
              totalNightsLenTillYesterday,
              tonight,
              totalNightsLenTillYesterday + tonight);*/
  return  totalNightsLenTillYesterday + tonight;
};

export const isOpenShutterOn = (downtime, hasNightEnded) => {
  //console.log(downtime.currentBin, hasNightEnded);
  if ( downtime.currentBin != null 
    &&
    [
      actionTypes.WEATHERLOSS,
      actionTypes.TECHDOWNTIME,
      actionTypes.POORWTHPROG
    ].includes(downtime.currentBin)
    && !hasNightEnded) {
    return false;
  } else if (!hasNightEnded) {
    return true;
  } else {
    return false;
  }
};