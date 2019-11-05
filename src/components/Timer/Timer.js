import React, { useState, useEffect } from 'react';
import classes from './Timer.module.css';

/*
From: https://upmostly.com/tutorials/build-a-react-timer-component-using-hooks
*/

const Timer = (props) => {
    var cdate = new Date();
        var initSeconds = (cdate.getTime() - props.initDate.getTime()) /1000;
  const [seconds, setSeconds] = useState(initSeconds);
  //const [isActive, setIsActive] = useState(false);

  /*function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }*/

  useEffect(() => {
    let interval = null;
    if (props.isActive) {
        
      interval = setInterval(() => {
        //console.log("Timer->useEffect->setInterval", seconds);
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!props.isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [props.isActive, seconds]);

  /*return (
    <div className={classes.app}>
      <div className={classes.time}>
        {seconds}s
      </div>
      <div className={classes.row}>
        <button className={`button button-primary button-primary-${isActive ? 'active' : 'inactive'}`} onClick={toggle}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className="button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );*/

  let secondsToTime = (tsecs) => {
    var hours   = Math.floor(tsecs / 3600);
    var minutes = Math.floor((tsecs - (hours * 3600)) / 60);
    var seconds = Math.round(tsecs - (hours * 3600) - (minutes * 60));

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+ seconds;
}
  return (
    <div className={classes.app}>
      <div className={classes.time}>
          {secondsToTime(seconds)}
      </div>
    </div>
  );
};

export default Timer;