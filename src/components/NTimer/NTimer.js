import React, {Component} from 'react';
import classes from './NTimer.module.css';


// Helper function that takes store state
// and returns the current elapsed time  
  class NTimer extends Component {

    state = { seconds:0};

    interval=null;
    constructor(props) {
      super(props);

      
      //if (props.debug) {
      //  console.log("NTimer construct seconds:" + props.initSeconds);
      //}
      var initSeconds = props.initSeconds==null?
//        Math.abs(((new Date()).getTime() - props.initDate.getTime()) /1000):
        Math.abs(((new Date()) - props.initDate) /1000):
        props.initSeconds;

      //console.log("NTimer:", this.props.initDate, initSeconds);
      this.state = {seconds:initSeconds};
    }
  
    componentDidMount() {
      var step = this.props.step==null?1:this.props.step;
      //console.log("componentDidMount:", this.props.step);

      if (this.props.isActive) {
        //if (this.props.debug === true) {
          //console.log("NTimer seconds:" + this.state.seconds);
        //}
        this.interval = setInterval( 
          () => this.setState({"seconds": this.state.seconds + step})
        , Math.abs(step*1000));
      }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.initDate !== nextProps.initDate) {
        clearInterval(this.interval);
        if (nextProps.debug) {
        }
        var initSeconds = Math.abs(((new Date()) - nextProps.initDate) /1000);
        //console.log("compWillReceiveProps:", initSeconds);

        this.setState({seconds:initSeconds});
        this.interval = setInterval( 
          () => this.setState({"seconds": this.state.seconds+ nextProps.step})
        , Math.abs(nextProps.step*1000));
      }

    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }
  
    secondsToTime = (tsecs) => {
      var hours   = Math.floor(tsecs / 3600);
      var minutes = Math.floor((tsecs - (hours * 3600)) / 60);
      var seconds = Math.round(tsecs - (hours * 3600) - (minutes * 60));
  
      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      if (seconds === 60) {seconds = "00";}
      return hours+':'+minutes+':'+ seconds;
    }

    render() {
      var seconds = this.props.isActive? this.state.seconds: this.props.initSeconds;
      /*console.log("NTimer:", this.state.seconds, this.props.initSeconds);*/
      /*if (this.props.debug) {
        console.log("NTimer seconds:" + this.props.initSeconds);
      }*/
      return (
        <div className={classes.app}>
          <div className={classes.time}>
              {this.secondsToTime(seconds)}
          </div>
        </div>
      );
    }
  }
  
  export default NTimer;