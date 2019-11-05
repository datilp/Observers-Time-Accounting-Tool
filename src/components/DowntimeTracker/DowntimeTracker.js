import React from "react";
import classes from "./DowntimeTracker.module.css";
import DTR from "./DowntimeTrackerRow/DowntimeTrackerRow";
import * as actionTypes from "../../store/actions/actionTypes";

const downtimeTracker = props => {
  const rowList = [
      { id: actionTypes.WEATHERLOSS, name: "Total Weather Loss", button:true},
      { id: actionTypes.POORWTHPROG, name: "Poor Weather Program", button:true },
      { id: actionTypes.TECHDOWNTIME, name: "Technical Downtime", button:true },
      { id: actionTypes.CALIBRATION, name: "Calibration", button:true },
      { id: actionTypes.OPENSHUTTER, name: "Open Shutter", button:false }
    ];
  var rowno = 0;
  const downtimeRows = rowList.map(bin => {
    return <DTR key={rowno++} rowName={bin.name} binType={bin.id} button={bin.button}/>
  })

  return (
    /* 
      style={
        {
    width:"95%", 
    backgroundColor:"#AFF",
    left:"0%",
    top:"0%", 
    margin:"10px 10px 10px 10px",
    flexFlow:"column",
    border:"3px solid #000"}}
      
      */
    <div className={classes.WeatherLoss}>
      <table>
        <tbody>
          <tr>
            <th colSpan="3"></th>
            <th>Tonight(h)</th>
            <th>Total(h)</th>
            {/*<th>Tonight(%)</th>
            <th>Total(%)</th>*/}
          </tr>
          {downtimeRows}
        </tbody>
      </table>
    </div>
  );
};

export default downtimeTracker;
