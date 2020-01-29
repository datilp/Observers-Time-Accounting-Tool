import React, {Component} from "react";
import classes from "./ProgramTrackerRow.module.css";
import Button from "../../UI/Button/Button";
//import cButton from "../../UI/Button/Button.module.css";
import {connect} from 'react-redux';
import NTimer from "../../NTimer/NTimer";

//import * as actionTypes from "../../../store/actions/actionTypes";
import {getDate} from "../../../utility";
import * as actionCreators from "../../../store/actions/index";
import * as actionTypes from "../../../store/actions/actionTypes"
import editImg from '../../../assets/images/edit3.png';
import Modal from "../../UI/Modal/Modal";
import IntervalGridEditor from "../../IntervalGridEditor/IntervalGridEditor";




class ProgramTrackerRow extends Component {
  state = {
    startTimer: false,
    editing:false
  };

  startClock = (props) => {

    //if the night has ended disable buttons
    if (props.appState.isEndOfNight || !props.appState.isStartOfNight) { 
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
  editHandler = () => {
    //console.log("***edit handler");
    this.setState({editing:true});
  }
  
  closeEditing = () => {
    //console.log("***close editing");
    this.setState({editing:false})
  }

  editInterval = () => {
    
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
      [<tr key="a">
        <td>
          
          <Modal show={this.state.editing} modalClosed={this.closeEditing}>
            <IntervalGridEditor
              key={this.props.id + this.props.nights.current}
              binType={actionTypes.PROGRAM_TYPE}
              closeEditing={this.closeEditing}
              pid={this.props.pid} 
              bin={this.props.prog.bins[this.props.pid]}/>
           </Modal>
        </td>
      </tr>,
      <tr className={classes.PTR} key="b">
        <td style={{width:"200px"}} key="1">{this.props.rowName}</td>
        <td style={{width:"90px"}} key="2">
           {(this.state.startTimer || this.props.prog.currentInterval !=null) && 
                this.props.prog.currentProgramID === this.props.pid?
            <NTimer 
              initDate={getDate(this.props.prog.currentInterval.starttime)} 
              isActive={true}
              step={1}/>
            : null}
        </td>
        {button}
        <td key="80">
          <button onClick={this.editHandler}><img src={editImg} alt={"edit time interval"}/></button>
        </td>
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
      ]
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
      dispatch(actionCreators.prgBinStartAction(thisPrgID));
/*
      if (type === actionTypes.PROGRAM_TYPE) {
        dispatch(actionCreators.prgBinStartAction(thisPrgID));
      } else if (type === actionTypes.POORWEATHER_TYPE) {
        dispatch(actionCreators.prgDWTBinStartAction(thisPrgID, actionTypes.POORWTHPROG));
      } else if (type === actionTypes.BACKUP_TYPE) {
        dispatch(actionCreators.prgDWTBinStartAction(thisPrgID, actionTypes.BACKUPPROG));
      }
      */ 
    },
    stopTimer: (thisPrgID) => {
      dispatch(actionCreators.prgBinStopAction(thisPrgID));

/*      if (type === actionTypes.PROGRAM_TYPE) {
        dispatch(actionCreators.prgBinStopAction(thisPrgID));
      } else if (type === actionTypes.POORWEATHER_TYPE) {
        dispatch(actionCreators.prgDWTBinStopAction(thisPrgID, actionTypes.POORWTHPROG));
      } else if (type === actionTypes.BACKUP_TYPE) {
        dispatch(actionCreators.prgDWTBinStopAction(thisPrgID, actionTypes.BACKUPPROG));
      }
      */
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProgramTrackerRow);
