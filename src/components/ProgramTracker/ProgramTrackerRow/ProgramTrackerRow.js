import React, {Component} from "react";
import classes from "./ProgramTrackerRow.module.css";
import Button from "../../UI/Button/Button";
//import cButton from "../../UI/Button/Button.module.css";
import {connect} from 'react-redux';
import NTimer from "../../NTimer/NTimer";

//import * as actionTypes from "../../../store/actions/actionTypes";
import {getDate} from "../../../utility";
import * as actionCreators from "../../../store/actions/index";

class ProgramTrackerRow extends Component {
  state = {
    startTimer: false
  };

startClock = (props) => {

  //if the night has ended disable buttons
  if (props.appState.isEndOfNight) { 
    return null;
  }

  this.setState({startTimer: true});
  //console.log("actionTypeStart:", props.actionTypeStart);
  return props.startTimer(props.pid);
}

stopTimer = (props) => {
  this.setState({startTimer: false});
  return props.stopTimer(props.pid);
}
  render() {
    //console.log("[ProgramTrackerRow]", this.props);
    var tonightTime=0;
    if (this.props.prog.bins !=null && this.props.prog.bins[this.props.pid]) {
      tonightTime=this.props.prog.bins[this.props.pid].tonightTime/(1000*60*60);
    }
    let button = null;
    if (this.props.button) {
      button = [<td key="3"></td>];
    } else {
      button = [
        <td key="3">
          <Button clicked={() => this.startClock(this.props)} btnType="Active">Start</Button>

          <Button clicked={() => this.stopTimer(this.props)} btnType="Stop">Stop</Button>
        </td>
      ];
    }
    
    var totalRunningTime = 0.0;
    if (this.props.totals.running_totals[this.props.pid]!=null) {
      /*console.log("inside props total " + this.props.pid);*/
      totalRunningTime = this.props.totals.running_totals[this.props.pid] *60*60;
    }
    //          <Timer initSeconds={totalRunningTime} isActive={false}/>

    return (
      <tr className={classes.PTR}>
        <td style={{width:"200px"}} key="1">{this.props.rowName}</td>
        <td style={{width:"90px"}} key="2">
           {(this.state.startTimer || this.props.prog.currentInterval !=null) && 
                this.props.prog.currentProgramID === this.props.pid?
            <NTimer 
              initDate={getDate(this.props.prog.currentInterval.starttime)} 
              isActive={true}/>
            : null}

        </td>
        {button}
        {/* Tonight(h) */}
        <td key="5" className={classes.box}>
          <label>
            <NTimer initSeconds={tonightTime*60*60} isActive={false}/>
          </label>
        </td>
        {/* Total(h) %*/}
        <td key="6" className={classes.box}>
        <label>
           <NTimer initSeconds={totalRunningTime} isActive={false}/>
        </label>
        </td>
        {/*<td key="7" className={classes.box}>
          <label></label>
        </td>
        <td key="8" className={classes.box}>
          <label></label>
        </td>*/}
        {/* Complete %*/}
        <td key="9" className={classes.box}>
          <label>
          {/*console.log(this.props.totals, this.props.prog.list.filter( elem => elem.id == this.props.pid)[0].alloc)*/}
          {this.props.totals.running_totals[this.props.pid]==null? "0.0%":
          parseFloat(
            this.props.totals.running_totals[this.props.pid]*100/
            this.props.prog.list.filter(elem => elem.id === this.props.pid)[0].alloc)
          .toFixed(3) + "%"}</label>
        </td>
      </tr>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(ProgramTrackerRow);
