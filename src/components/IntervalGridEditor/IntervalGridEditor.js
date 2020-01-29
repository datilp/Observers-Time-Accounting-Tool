import React, { Component } from "react";
import classes from "./IntervalGrid.module.css";
import {connect} from 'react-redux';
import * as actionCreators from "../../store/actions/index";
import * as actionTypes from "../../store/actions/actionTypes";
import IGR from "./IntervalGridRow";
import Button from "../UI/Button/Button";


/*
//helper to generate a random date
const randomDate = (start, end)  => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

//helper to create a fixed number of rows
const createRows = (numberOfRows) => {
  var _rows = [];
  for (var i = 1; i < numberOfRows; i++) {
    _rows.push({
      id: i,
      startInterval: randomDate(new Date(2018, 3, 1), new Date()),
      endInterval: randomDate(new Date(2018, 3, 1), new Date())
    });
  }
  return _rows;
}
*/

class IntervalGridEditor extends Component {
  /*
    props properties
    pid: proposal/bin id
    binType: either proposal or downtime
    bin: proposal/downtime bin array
  */
  constructor(props) {
    super(props);
    this.state = {open:true};

    if (this.props.bin !=null && this.props.bin.interval != null) {
      this.state = {"interval":[ ...this.props.bin.interval]};    
    } else {
      this.state = { "interval":[]};
    }
  }

  /* Note componentWillReceiveProps is discourage
  ** Instead pass a key for this component that is unique to
  ** its data e.g. DOWNTIME20200123-20200124
  */
  /*componentWillReceiveProps(nextProps) {
    if (nextProps.bin !=null && nextProps.bin.interval != null) {
      this.setState({"interval":[ ...nextProps.bin.interval]});   
    } else {
      this.setState({"interval":[]});   
    }
  }*/
  
  setInterval = (index, starttime, stoptime) => {
    let intervalElem = {'starttime':starttime, 'stoptime':stoptime};
    let interval = [...this.state.interval];
    if (index !=null) {
      interval[index] = intervalElem;
      this.setState({'interval': interval});
    } else {
      interval.push(intervalElem);
      this.setState({'interval': interval});
    }
  }

  updateInterval = () => {
    //console.log("[IntervalGridEditor]:updateInterval", this.props.binType);
    if(this.props.binType === actionTypes.PROGRAM_TYPE) {
      this.props.prgUpdateInterval(this.props.pid, this.state.interval);
    } else {
      this.props.dwnUpdateInterval(this.props.pid, this.state.interval);
    }
    this.props.closeEditing();
  }

  addInterval = () => {
    //console.log("[IntervalGridEditor]:addInterval");
    //this.props.dwnUpdateInterval(this.props.key, this.state.interval);
    let intervals = [ ...this.state.interval];
    let newTime = new Date();
    let newInterval = { 'starttime': newTime, 'stoptime': newTime };
    intervals.push(newInterval);
    this.setState({'interval':intervals});
  }

  delHandler = (index) => {
    let intervals = [...this.state.interval];
    intervals.splice(index,1);
    //this.interval = intervals;
    this.setState({'interval': intervals})
  }

  render() {
    //console.log("[IntervalRow:]", this.state.interval);

    /*const intervalRows2 = createRows(5).map( row => {
        return <IGR key={row.id} startInterval={row.startInterval} endInterval={row.endInterval} />;
    })*/

    const intervalRows = this.state.interval.length === 0?
    null:

    this.state.interval.map( (row, index) => {
        /*console.log("[IntervalRow:]", index,
        row.starttime, 
        new Date(row.starttime),
        row.stoptime,
        new Date(row.stoptime));*/
        return <IGR 
                  key={index} 
                  index={index}
                  delHandler={this.delHandler}
                  setInterval={this.setInterval} 
                  pid={this.props.pid}
                  startInterval={row.starttime} 
                  endInterval={row.stoptime} />;
    });


    return (
     <div className={classes.IntervalGrid}>
       <div style={{display:"flex", justifyContent:'center', alignItems:'center', width:"100%"}}>
         <span style={{fontWeight:"bold", padding:"0px 15px 0px 0px"}}>{this.props.pid}</span>
         <span style={{fontWeight:"bold", padding:"0px 15px 0px 0px"}}>{"(UTC)"}</span>
         </div>
        <table>
            <tbody>
          <tr>
            <th></th>
            <th>Start</th>
            <th>End</th>
            <th>Hours</th>
          </tr>
          {intervalRows}
          <tr>
            <td colSpan="4" style={{textAlign:"center"}}>
              <Button clicked={this.updateInterval} btnType="Active">Update</Button>
              <Button clicked={this.addInterval} btnType="Active">Add Row</Button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    dwnUpdateInterval: (thisPrgID, interval) => {
      dispatch(actionCreators.dwnBinUpdateAction(thisPrgID, interval))
    },
    prgUpdateInterval: (thisPrgID, interval) => {
      dispatch(actionCreators.prgBinUpdateAction(thisPrgID, interval))
    }
  };
};


export default connect(null, mapDispatch)(IntervalGridEditor);