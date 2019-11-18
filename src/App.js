import React, { Component } from 'react';
import MiniQ from './containers/miniQ/miniQ';
import {connect}  from 'react-redux';
import {bindActionCreators} from 'redux';
import instance from './axiosInstance';
import fetchStateAction from './store/actions/fetchState';
import {appStateUpdateDispatch} from './store/actions/appState';
import withErrorHandler from './hoc/withErrorHandler/withErrorHandler';



class App extends Component {
  counter=0;

  //checks if the end of night has arrived
  endOfNightTimer = null;

  constructor(props) {
    super(props);
    this.props.fetchState();

    this.endOfNightTimer = setInterval( () => 
    {this.props.hasNightEnded()}, 10000);
  }
  
  componentWillUnmount() {
      //console.log("clear interval endOfNightTimer");
      clearInterval(this.endOfNightTimer);
  }

  /*componentDidMounts() {
    //fetchs original state from server
    this.props.fetchState();

    this.endOfNightTimer = setInterval( () => 
    this.props.hasNightEnded(), 10000);

  }*/
  render() {
    return (
      <div>
          <MiniQ />        
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => bindActionCreators({
  fetchState: fetchStateAction,
  hasNightEnded: appStateUpdateDispatch
}, dispatch)

export default connect(null, mapDispatchToProps)(withErrorHandler(App, instance));