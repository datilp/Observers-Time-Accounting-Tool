import React, {Component} from "react";
import classes from "./IntervalGridRow.module.css";
import DatePicker from 'react-datepicker';
import delImg from '../../assets/images/delete.png';
import {getDate} from '../../utility';
import {zonedTimeToUtc, utcToZonedTime} from 'date-fns-tz';

class IntervalGridRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            startInterval: this.props.startInterval,
            endInterval: this.props.endInterval
          };
                
    }

  startIntervalChange = (date) => {
    //console.log("handleChange start:", date);
    this.setState({startInterval: date});
    this.props.setInterval(this.props.index, date, this.state.endInterval);

  }

  endIntervalChange = (date) => {
    //console.log("handleChange end:", date);
    this.setState({endInterval: date});
    this.props.setInterval(this.props.index, this.state.startInterval, date);

  }

  render() {
    /*console.log("[IntervalGridRow]", 
    this.props.pid,
    this.props.startInterval,
    this.state.startInterval,
    this.props.endInterval,
    this.state.endInterval);*/
    return (
      <tr className={classes.IGR}>
        <td style={{width:"10px"}} key="0">
        <button onClick={() => this.props.delHandler(this.props.index)}>
          <img src={delImg} alt="delete interval"/>
        </button>
        </td>
        <td style={{width:"100px"}} key="1">
          <DatePicker     
              selected={utcToZonedTime(this.props.startInterval, 'UTC')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy/MM/dd HH:mm"
              onChange={(date) => this.startIntervalChange(zonedTimeToUtc(date, 'UTC'))}/>
        </td>
        <td style={{width:"100px"}} key="2">
          <DatePicker     
              selected={utcToZonedTime(this.props.endInterval, 'UTC')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy/MM/dd HH:mm"
              onChange={(date) => this.endIntervalChange(zonedTimeToUtc(date, 'UTC'))}/> 
        </td>
        <td style={{width:"100px"}} key="3">
            {parseFloat((getDate(this.props.endInterval) - getDate(this.props.startInterval))/(60*60*1000)).toFixed(3) + " hrs"}
        </td>
        
      </tr>
    );
  }
}

/*
const mapStateToProps = state => {
  return {
    nights: state.nights,
    prog: state.programs.programs,
    totals: state.totals,
    appState: state.appState
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startTimer: (thisPrgID) => {
      dispatch(actionCreators.prgBinStartAction(thisPrgID))
    },
    stopTimer: (thisPrgID) => {
      dispatch(actionCreators.prgBinStopAction(thisPrgID))
    }
  };
};
*/
//export default connect(mapStateToProps, mapDispatchToProps)(IntervalRow);
export default IntervalGridRow;
