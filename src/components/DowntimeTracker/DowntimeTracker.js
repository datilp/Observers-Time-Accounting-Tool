import React, {Component} from "react";
import classes from "./DowntimeTracker.module.css";
import DTR from "./DowntimeTrackerRow/DowntimeTrackerRow";
import * as actionTypes from "../../store/actions/actionTypes";
class DowntimeTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {open:true, editing:false}
  }

  editHandler = () => {
    //console.log("***edit handler");
    this.setState({editing:true});
  }
  
  cancelEditing = () => {
    //console.log("***cancel purchase");
    this.setState({editing:false})
  }
  
  render() {
    const rowList = [
        { id: actionTypes.WEATHERLOSS, name: "Total Weather Loss", button:true, editable:true},
        { id: actionTypes.TECHDOWNTIME, name: "Technical Downtime", button:true, editable:true },
        { id: actionTypes.CALIBRATION, name: "Calibration", button:true, editable:true},
        { id: actionTypes.POORWTHPROG, name: "Poor Weather Programs", button:false, editable:false },
        { id: actionTypes.BACKUPPROG, name: "Backup Programs", button:false, editable:false },
        { id: actionTypes.HUMANERROR, name: "Human Error", button:false, editable:true },
        { id: actionTypes.OPENSHUTTER, name: "Open Shutter", button:false, editable:false }
      ];
    var rowno = 0;
    const downtimeRows = rowList.map(bin => {
      return <DTR 
                key={rowno++} 
                rowName={bin.name}
                editHandler={this.editHandler}
                editable={bin.editable}
                binType={bin.id}
                button={bin.button}/>
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
              <th></th>
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
  }
}

export default DowntimeTracker;
