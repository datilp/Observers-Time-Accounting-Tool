import React, {Component} from 'react';
import {connect} from 'redux';

// Helper function that takes store state
// and returns the current elapsed time
function getElapsedTime(baseTime, startedAt, stoppedAt = new Date().getTime()) {
    if (!startedAt) {
      return 0;
    } else {
      return stoppedAt - startedAt + baseTime;
    }
  }
  
  class NumericTimer extends Component {
    componentDidMount() {
      this.interval = setInterval(this.forceUpdate.bind(this), this.props.updateInterval || 33);
    }
  
    componentWillUnmount() {
      clearInterval(this.interval);
    }
  
    render() {
      const { baseTime, startedAt, stoppedAt } = this.props;
      const elapsed = getElapsedTime(baseTime, startedAt, stoppedAt);
  
      return (
        <div>
          <div>Time: {elapsed}</div>
          <div>
            <button onClick={() => this.props.startNumericTimer(elapsed)}>Start</button>
            <button onClick={() => this.props.stopNumericTimer()}>Stop</button>
            <button onClick={() => this.props.resetNumericTimer()}>Reset</button>
          </div>
        </div>
      );
    }
  }
  
  function mapStateToProps(state) {
    const { baseTime, startedAt, stoppedAt } = state;
    return { baseTime, startedAt, stoppedAt };
  }
  
  NumericTimer = connect(mapStateToProps, { startNumericTimer, stopNumericTimer, resetNumericTimer })(NumericTimer);