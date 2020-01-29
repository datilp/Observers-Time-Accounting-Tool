import React, { Component } from "react";
import classes from "./DowntimeTrackerRow.module.css";
import genKey from ".././../../assets/GenerateKey";
import Button from "../../UI/Button/Button";
import {connect} from 'react-redux';
//import Clock from "../../Clock/Clock";
import NTimer from "../../NTimer/NTimer";
import * as actionTypes from "../../../store/actions/actionTypes";
import {getDate,isOpenShutterOn} from "../../../utility";
import * as actionCreators from "../../../store/actions/index";
import editImg from '../../../assets/images/edit3.png';
import Modal from "../../UI/Modal/Modal";
import IntervalGridEditor from "../../IntervalGridEditor/IntervalGridEditor";


class DowntimeTrackerRow extends Component {
  state = {
      startTimer: false,
      editing:false
    };

  startClock = (props) => {
    //if the night has ended disable buttons
    if (props.appState.isEndOfNight || !props.appState.isStartOfNight) { 
    //&& props.binType !== actionTypes.CALIBRATION) {
      return null;
    }

    this.setState({startTimer: true});
    return props.startTimer(props.binType);
  }

  stopTimer = (props) => {
    this.setState({startTimer: false});
    return props.stopTimer(props.binType);
  }

  openShutterTonight() {
    //var tonightTime=0;
    const bins = this.props.dwt.downtime.bins;

    return bins[actionTypes.OPENSHUTTER]==null? 0.0:
       bins[actionTypes.OPENSHUTTER].tonightTime/1000;
  }

  editHandler = () => {
    //console.log("***edit handler");
    this.setState({editing:true});
  }
  
  closeEditing = () => {
    //console.log("***close editing");
    this.setState({editing:false})
  }

  render() {
    //console.log("DowntimeTrackerRow", this.props.dwt);
    var tonightTime=0;
    if (this.props.dwt.downtime.bins !=null && this.props.dwt.downtime.bins[this.props.binType]) {
      tonightTime=this.props.dwt.downtime.bins[this.props.binType].tonightTime/1000;
    }
    let button = null;
    if (this.props.button) {
      button = [
        <td key={genKey(Math.random())}>
          {/*<Button clicked={() => this.props.startTimer(this.props.actionTypeStart)} btnType="Active">Start</Button>*/}
          {<Button clicked={() => this.startClock(this.props)} btnType="Active">Start</Button>}

          <Button clicked={() => this.stopTimer(this.props)} btnType="Stop">Stop</Button>
        </td>
      ];
    } else {
      button = [<td key={genKey(Math.random())}></td>];
    }
    return (
        [<tr key="a">
          <td key="69">
            
            <Modal show={this.state.editing} modalClosed={this.closeEditing}>
              <IntervalGridEditor
                key={this.props.binType + this.props.nights.current}
                binType="downtime"
                closeEditing={this.closeEditing}
                pid={this.props.binType} 
                //bins={_bins}
                bin={this.props.dwt.downtime.bins[this.props.binType]}/>
             </Modal>
          </td>
        </tr>,
      <tr className={classes.DTR} key="b">
        <td style={{width:"190px"}} key={genKey(Math.random())}>{this.props.rowName}</td>
        <td style={{width:"90px"}} key={genKey(Math.random())}>
            {(this.state.startTimer || this.props.dwt.downtime.currentInterval !=null) && 
                this.props.dwt.downtime.currentBin === this.props.binType?
            <NTimer initDate={getDate(this.props.dwt.downtime.currentInterval.starttime)} isActive={true} step={1}/>: null}
        </td>
        {button}
        <td key="80">
          {(this.props.editable)?
          <button onClick={this.editHandler}><img src={editImg} alt={"edit time intervals"}/></button>:
          null
          }
        </td>
        <td key={genKey(Math.random())} className={classes.box}>
          <label>
            {
            this.props.binType === actionTypes.OPENSHUTTER?
            <NTimer initSeconds={this.openShutterTonight()}
            isActive={isOpenShutterOn(this.props.dwt.downtime, this.props.prog, !this.props.appState.isEndOfNight &&
              this.props.appState.isStartOfNight)}/> : 
            <NTimer initSeconds={tonightTime} isActive={false}/>
            }
            </label>
        </td>
        <td key={genKey(Math.random())} className={classes.box}>
          <label>
            {
              this.props.binType === actionTypes.OPENSHUTTER?
              <NTimer initSeconds={this.props.totals.running_totals[this.props.binType]==null?
                0.0:this.props.totals.running_totals[this.props.binType]*60*60} 
                isActive={isOpenShutterOn(this.props.dwt.downtime, this.props.prog, !this.props.appState.isEndOfNight &&
                  this.props.appState.isStartOfNight)}/>
              :
              <NTimer initSeconds={this.props.totals.running_totals[this.props.binType]==null?
                0.0:this.props.totals.running_totals[this.props.binType]*60*60} isActive={false}/>
      
            }
          </label>
        </td>
      </tr>
        ]
    );
  }
}
const mapStateToProps = state => {
  return {
    dwt: state.downtime,
    prog: state.programs.programs,
    nights: state.nights,
    totals: state.totals,
    appState: state.appState
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startTimer: (thisBin) => {
      dispatch(actionCreators.dwnBinStartAction(thisBin))
    },
    stopTimer: (thisBin) => {
      dispatch(actionCreators.dwnBinStopAction(thisBin))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DowntimeTrackerRow);
